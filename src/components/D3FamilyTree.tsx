"use client";

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface RelationshipData {
  _id: string;
  personId1: any;
  personId2: any;
  relationType: string;
  description?: string;
  isApproved: boolean;
}

interface FamilyTreeViewProps {
  relationships: RelationshipData[];
  currentUserId: string;
  currentUserName: string;
  onNodeClick?: (userId: string) => void;
}

interface TreeNode {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  initials: string;
  profilePicture?: string;
  gothiram?: string;
  nativePlace?: string;
  isCurrentUser: boolean;
  children?: TreeNode[];
  relationshipType?: string;
  isApproved?: boolean;
  x?: number;
  y?: number;
}

export default function D3FamilyTree({ relationships, currentUserId, currentUserName, onNodeClick }: FamilyTreeViewProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [nodeCount, setNodeCount] = useState(0);
  const [edgeCount, setEdgeCount] = useState(0);

  useEffect(() => {
    console.log('🎯 D3FamilyTree received data:');
    console.log('📊 Relationships count:', relationships?.length || 0);
    console.log('📊 Relationships data:', relationships);
    console.log('👤 Current User ID:', currentUserId);
    console.log('👤 Current User Name:', currentUserName);

    if (!relationships || relationships.length === 0) {
      console.log('⚠️  No relationships found - showing only current user');
      renderSingleNode();
      return;
    }

    renderFamilyTree();
  }, [relationships, currentUserId, currentUserName, dimensions]);

  const updateDimensions = () => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      setDimensions({ width: clientWidth, height: clientHeight });
    }
  };

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const renderSingleNode = () => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = dimensions.width;
    const height = dimensions.height;

    svg.attr("width", width).attr("height", height);

    const g = svg.append("g")
      .attr("transform", `translate(${width/2}, ${height/2})`);

    // Create single node for current user
    createNode(g, 0, 0, {
      id: currentUserId,
      name: currentUserName,
      firstName: currentUserName.split(' ')[0],
      lastName: currentUserName.split(' ').slice(1).join(' ') || '',
      initials: currentUserName.split(' ').map(n => n[0]).join(''),
      isCurrentUser: true,
    });

    setNodeCount(1);
    setEdgeCount(0);
  };

  const createNode = (container: d3.Selection<SVGGElement, unknown, null, undefined>, x: number, y: number, nodeData: TreeNode) => {
    const nodeGroup = container.append("g")
      .attr("class", "node")
      .attr("transform", `translate(${x}, ${y})`)
      .style("cursor", "pointer");

    // Node background (matching FamilyTreeView style)
    nodeGroup.append("rect")
      .attr("x", -100)
      .attr("y", -80)
      .attr("width", 200)
      .attr("height", 160)
      .attr("rx", 10)
      .attr("fill", "white")
      .attr("stroke", nodeData.isCurrentUser ? "#3b82f6" : "#e5e7eb")
      .attr("stroke-width", nodeData.isCurrentUser ? 3 : 2)
      .attr("filter", "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))");

    // Avatar circle (matching FamilyTreeView size)
    nodeGroup.append("circle")
      .attr("cx", 0)
      .attr("cy", -30)
      .attr("r", 30)
      .attr("fill", nodeData.isCurrentUser ? "#3b82f6" : "#8b5cf6")
      .attr("stroke", "white")
      .attr("stroke-width", 4);

    // Avatar initials
    nodeGroup.append("text")
      .attr("x", 0)
      .attr("y", -25)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", "16")
      .attr("font-weight", "bold")
      .text(nodeData.initials);

    // Name
    nodeGroup.append("text")
      .attr("x", 0)
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .attr("fill", "#1f2937")
      .attr("font-size", "14")
      .attr("font-weight", "bold")
      .text(nodeData.name);

    // Gothiram
    if (nodeData.gothiram) {
      nodeGroup.append("text")
        .attr("x", 0)
        .attr("y", 35)
        .attr("text-anchor", "middle")
        .attr("fill", "#6b7280")
        .attr("font-size", "12")
        .text(nodeData.gothiram);
    }

    // Native place
    if (nodeData.nativePlace) {
      nodeGroup.append("text")
        .attr("x", 0)
        .attr("y", 50)
        .attr("text-anchor", "middle")
        .attr("fill", "#9ca3af")
        .attr("font-size", "10")
        .text(nodeData.nativePlace);
    }

    // "You" badge for current user (matching FamilyTreeView style)
    if (nodeData.isCurrentUser) {
      // Background for "You" badge
      nodeGroup.append("rect")
        .attr("x", -20)
        .attr("y", 62)
        .attr("width", 40)
        .attr("height", 16)
        .attr("rx", 8)
        .attr("fill", "#dbeafe")
        .attr("opacity", 0.8);
      
      nodeGroup.append("text")
        .attr("x", 0)
        .attr("y", 72)
        .attr("text-anchor", "middle")
        .attr("fill", "#2563eb")
        .attr("font-size", "10")
        .attr("font-weight", "500")
        .text("You");
    }

    // Relationship type badge (if exists)
    if (nodeData.relationshipType) {
      // Background for relationship badge
      nodeGroup.append("rect")
        .attr("x", -30)
        .attr("y", 80)
        .attr("width", 60)
        .attr("height", 16)
        .attr("rx", 8)
        .attr("fill", "none")
        .attr("stroke", "#E63946")
        .attr("stroke-width", 1);
      
      nodeGroup.append("text")
        .attr("x", 0)
        .attr("y", 90)
        .attr("text-anchor", "middle")
        .attr("fill", "#E63946")
        .attr("font-size", "10")
        .attr("font-weight", "500")
        .text(nodeData.relationshipType);
    }

    // Add click event handler
    nodeGroup.on("click", () => {
      if (onNodeClick) {
        onNodeClick(nodeData.id);
      }
    });

    // Add hover effects
    nodeGroup.on("mouseenter", function() {
      d3.select(this).select("rect")
        .attr("stroke", "#3b82f6")
        .attr("stroke-width", 3);
    });

    nodeGroup.on("mouseleave", function() {
      d3.select(this).select("rect")
        .attr("stroke", nodeData.isCurrentUser ? "#3b82f6" : "#e5e7eb")
        .attr("stroke-width", nodeData.isCurrentUser ? 3 : 2);
    });

    return nodeGroup;
  };

  const createOrthogonalLink = (container: d3.Selection<SVGGElement, unknown, null, undefined>, 
                     source: {x: number, y: number}, 
                     target: {x: number, y: number}, 
                     relationshipType: string, 
                     isApproved: boolean) => {
    
    const linkGroup = container.append("g")
      .attr("class", "orthogonal-link");

    // Calculate orthogonal path points
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const isVertical = Math.abs(dy) > Math.abs(dx);
    
    let pathPoints: { x: number; y: number }[] = [];
    
    if (isVertical) {
      // Vertical relationship (parent-child)
      const midY = source.y + (dy > 0 ? 80 : -80); // 80px spacing from node edges
      
      if (Math.abs(dx) < 50) {
        // Direct vertical line with small horizontal adjustment
        pathPoints = [
          { x: source.x, y: source.y + (dy > 0 ? 80 : -80) },
          { x: source.x, y: midY },
          { x: target.x, y: midY },
          { x: target.x, y: target.y + (dy > 0 ? -80 : 80) }
        ];
      } else {
        // L-shaped path for better visual separation
        const horizontalOffset = dx > 0 ? 80 : -80;
        pathPoints = [
          { x: source.x, y: source.y + (dy > 0 ? 80 : -80) },
          { x: source.x, y: midY },
          { x: source.x + horizontalOffset, y: midY },
          { x: source.x + horizontalOffset, y: target.y + (dy > 0 ? -80 : 80) },
          { x: target.x, y: target.y + (dy > 0 ? -80 : 80) }
        ];
      }
    } else {
      // Horizontal relationship (spouse, sibling)
      const midX = source.x + dx / 2;
      const verticalOffset = dy > 0 ? 40 : -40;
      
      pathPoints = [
        { x: source.x + (dx > 0 ? 80 : -80), y: source.y },
        { x: midX, y: source.y },
        { x: midX, y: source.y + verticalOffset },
        { x: target.x + (dx > 0 ? -80 : 80), y: source.y + verticalOffset },
        { x: target.x + (dx > 0 ? -80 : 80), y: target.y }
      ];
    }

    // Create the orthogonal path
    let pathData = `M ${pathPoints[0].x} ${pathPoints[0].y}`;
    for (let i = 1; i < pathPoints.length; i++) {
      pathData += ` L ${pathPoints[i].x} ${pathPoints[i].y}`;
    }

    linkGroup.append("path")
      .attr("d", pathData)
      .attr("stroke", isApproved ? "#10b981" : "#f59e0b")
      .attr("stroke-width", isApproved ? 3 : 2)
      .attr("stroke-dasharray", isApproved ? "0" : "8,4")
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .attr("fill", "none")
      .attr("opacity", 0.9);

    // Add arrowhead at the end
    const lastPoint = pathPoints[pathPoints.length - 1];
    const secondLastPoint = pathPoints[pathPoints.length - 2];
    const arrowDx = lastPoint.x - secondLastPoint.x;
    const arrowDy = lastPoint.y - secondLastPoint.y;
    const arrowLength = Math.sqrt(arrowDx * arrowDx + arrowDy * arrowDy);
    const arrowUnitX = arrowDx / arrowLength;
    const arrowUnitY = arrowDy / arrowLength;
    
    const arrowSize = 12;
    const arrowX = lastPoint.x - arrowUnitX * 15;
    const arrowY = lastPoint.y - arrowUnitY * 15;

    linkGroup.append("path")
      .attr("d", `M ${arrowX - arrowSize * arrowUnitX} ${arrowY - arrowSize * arrowUnitY} L ${arrowX} ${arrowY} L ${arrowX + arrowSize * arrowUnitY} ${arrowY - arrowSize * arrowUnitX}`)
      .attr("fill", isApproved ? "#10b981" : "#f59e0b")
      .attr("stroke", "none");

    // Add relationship type label at a good position
    const labelPoint = pathPoints[Math.floor(pathPoints.length / 2)];
    
    // Background for label
    linkGroup.append("rect")
      .attr("x", labelPoint.x - 30)
      .attr("y", labelPoint.y - 10)
      .attr("width", 60)
      .attr("height", 20)
      .attr("rx", 4)
      .attr("fill", "#ffffff")
      .attr("opacity", 0.95)
      .attr("stroke", isApproved ? "#10b981" : "#f59e0b")
      .attr("stroke-width", 1);
    
    linkGroup.append("text")
      .attr("x", labelPoint.x)
      .attr("y", labelPoint.y + 5)
      .attr("text-anchor", "middle")
      .attr("fill", "#000000")
      .attr("font-size", "12")
      .attr("font-weight", "600")
      .text(relationshipType);

    return linkGroup;
  };

  const renderFamilyTree = () => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = dimensions.width;
    const height = dimensions.height;
    const margin = { top: 80, right: 80, bottom: 80, left: 80 };

    svg.attr("width", width).attr("height", height);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const contentWidth = width - margin.left - margin.right;
    const contentHeight = height - margin.top - margin.bottom;

    // Build person map
    const personMap = new Map<string, any>();
    
    // Add current user to map
    personMap.set(currentUserId, {
      _id: currentUserId,
      firstName: currentUserName.split(' ')[0],
      lastName: currentUserName.split(' ').slice(1).join(' ') || '',
      isCurrentUser: true,
    });

    // Add all people from relationships
    relationships.forEach(rel => {
      if (rel.personId1 && !personMap.has(rel.personId1._id)) {
        personMap.set(rel.personId1._id, {
          ...rel.personId1,
          firstName: rel.personId1.firstName || 'Unknown',
          lastName: rel.personId1.lastName || ''
        });
      }
      if (rel.personId2 && !personMap.has(rel.personId2._id)) {
        personMap.set(rel.personId2._id, {
          ...rel.personId2,
          firstName: rel.personId2.firstName || 'Unknown',
          lastName: rel.personId2.lastName || ''
        });
      }
    });

    console.log('👥 People in tree:', Array.from(personMap.values()).map(p => ({ name: `${p.firstName} ${p.lastName}`, id: p._id })));

    // Build relationship graph
    const relationshipGraph = new Map<string, Array<{person: any, type: string, relId: string, approved: boolean}>>();
    
    relationships.forEach(rel => {
      if (!rel.personId1 || !rel.personId2) return;
      const a = rel.personId1._id;
      const b = rel.personId2._id;

      if (!relationshipGraph.has(a)) relationshipGraph.set(a, []);
      if (!relationshipGraph.has(b)) relationshipGraph.set(b, []);

      relationshipGraph.get(a)!.push({ person: rel.personId2, type: rel.relationType, relId: rel._id, approved: rel.isApproved });
      relationshipGraph.get(b)!.push({ person: rel.personId1, type: rel.relationType, relId: rel._id, approved: rel.isApproved });
    });

    // Compute generations using BFS
    const generations = new Map<string, number>();
    const queue: string[] = [currentUserId];
    const visited = new Set<string>([currentUserId]);
    generations.set(currentUserId, 0);

    while (queue.length > 0) {
      const pid = queue.shift()!;
      const curGen = generations.get(pid) || 0;
      const neighbors = relationshipGraph.get(pid) || [];

      neighbors.forEach(({ person, type }) => {
        if (!person || !person._id) return;
        const nid = person._id;
        if (visited.has(nid)) return;

        let targetGen = curGen;

        // Determine generation based on relationship type
        if (['Father', 'Mother', 'Grand Father', 'Grand Mother', 'Uncle', 'Aunt'].includes(type)) {
          targetGen = curGen - 1;
        } else if (['Son', 'Daughter', 'Nephew', 'Niece'].includes(type)) {
          targetGen = curGen + 1;
        } else if (['Spouse', 'Brother', 'Sister', 'Sibling', 'Older Sibling', 'Younger Sibling', 'Cousin'].includes(type)) {
          targetGen = curGen;
        }

        generations.set(nid, targetGen);
        visited.add(nid);
        queue.push(nid);
      });
    }

    // Ensure everyone gets a generation
    Array.from(personMap.keys()).forEach((pid) => {
      if (!generations.has(pid)) {
        generations.set(pid, 1);
      }
    });

    console.log('🏗️ Generation mapping:', Object.fromEntries(generations));

    // Create nodes and position them by generation
    const nodes: TreeNode[] = [];
    const links: Array<{source: TreeNode, target: TreeNode, relationshipType: string, isApproved: boolean}> = [];

    // Group people by generation
    const generationGroups = new Map<number, string[]>();
    generations.forEach((gen, personId) => {
      if (!generationGroups.has(gen)) {
        generationGroups.set(gen, []);
      }
      generationGroups.get(gen)!.push(personId);
    });

    // Position nodes by generation
    const generationSpacing = 300; // Increased for better orthogonal line spacing
    const nodeSpacing = 350; // Increased for better horizontal separation
    const centerX = contentWidth / 2;

    generationGroups.forEach((personIds, gen) => {
      const startX = centerX - ((personIds.length - 1) * nodeSpacing) / 2;
      
      personIds.forEach((personId, index) => {
        const person = personMap.get(personId);
        if (!person) return;

        const node: TreeNode = {
          id: personId,
          name: `${person.firstName} ${person.lastName}`,
          firstName: person.firstName,
          lastName: person.lastName,
          initials: `${person.firstName?.[0] || ''}${person.lastName?.[0] || ''}`,
          profilePicture: person.profilePicture,
          gothiram: person.gothiram,
          nativePlace: person.nativePlace,
          isCurrentUser: personId === currentUserId,
          x: startX + index * nodeSpacing,
          y: 100 + gen * generationSpacing
        };

        nodes.push(node);
      });
    });

    // Create links from relationships
    const linkSet = new Set<string>();
    
    relationships.forEach(rel => {
      if (!rel.personId1 || !rel.personId2) return;
      
      const sourceNode = nodes.find(n => n.id === rel.personId1._id);
      const targetNode = nodes.find(n => n.id === rel.personId2._id);
      
      if (sourceNode && targetNode) {
        const gen1 = generations.get(rel.personId1._id) || 0;
        const gen2 = generations.get(rel.personId2._id) || 0;
        
        // Determine source and target based on generation (parent to child)
        let source = sourceNode;
        let target = targetNode;
        
        if (gen1 > gen2) {
          source = targetNode;
          target = sourceNode;
        }
        
        // Check for duplicates
        const linkKey = `${source.id}-${target.id}`;
        const reverseKey = `${target.id}-${source.id}`;
        
        if (!linkSet.has(linkKey) && !linkSet.has(reverseKey)) {
          linkSet.add(linkKey);
          
        links.push({
            source,
            target,
          relationshipType: rel.relationType,
          isApproved: rel.isApproved
        });
      }
      }
    });

    console.log('📊 Final nodes:', nodes.length);
    console.log('🔗 Final links:', links.length);

    setNodeCount(nodes.length);
    setEdgeCount(links.length);

    // Draw orthogonal links first (behind nodes) - Microsoft Teams style
    links.forEach(link => {
      if (link.source.x !== undefined && link.source.y !== undefined && 
          link.target.x !== undefined && link.target.y !== undefined) {
        createOrthogonalLink(g, 
          { x: link.source.x, y: link.source.y }, // Start from center of source node
          { x: link.target.x, y: link.target.y }, // End at center of target node
          link.relationshipType, 
          link.isApproved
        );
      }
    });

    // Draw nodes
    nodes.forEach(node => {
      if (node.x !== undefined && node.y !== undefined) {
        createNode(g, node.x, node.y, node);
      }
    });

    // Add zoom and pan behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom as any);

    // Fit view to show all nodes
    const nodePositions = nodes.filter(n => n.x !== undefined && n.y !== undefined);
    const bounds = nodePositions.length > 0 ? {
      x: Math.min(...nodePositions.map(n => n.x!)) - 100, 
      y: Math.min(...nodePositions.map(n => n.y!)) - 100, 
      width: Math.max(...nodePositions.map(n => n.x!)) - Math.min(...nodePositions.map(n => n.x!)) + 200,
      height: Math.max(...nodePositions.map(n => n.y!)) - Math.min(...nodePositions.map(n => n.y!)) + 200
    } : {
      x: 0, 
      y: 0, 
      width: contentWidth, 
      height: contentHeight
    };
    
    const fullWidth = width - margin.left - margin.right;
    const fullHeight = height - margin.top - margin.bottom;
    const scale = Math.min(fullWidth / bounds.width, fullHeight / bounds.height) * 0.8;
    const translate = [
      fullWidth / 2 - scale * (bounds.x + bounds.width / 2),
      fullHeight / 2 - scale * (bounds.y + bounds.height / 2)
    ];
    
    g.transition().duration(750).call(
      zoom.transform as any,
      d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
    );
  };


  return (
    <div className="w-full h-[750px] bg-gradient-to-br from-indigo-50 via-white to-emerald-50 rounded-2xl border-4 border-indigo-200 shadow-2xl overflow-hidden">
      <div ref={containerRef} className="w-full h-full relative">
        {/* Family Tree Info Panel */}
        <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 backdrop-blur-md p-3 rounded-2xl shadow-2xl border-3 border-white/30">
          <div className="text-white">
            <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
              <span className="text-lg">🌳</span>
              Family Tree
            </h3>
            <div className="flex items-center gap-3 text-xs">
              <span className="bg-white/20 px-2 py-1 rounded-full font-semibold">
                {nodeCount} Members
              </span>
              <span className="bg-white/20 px-2 py-1 rounded-full font-semibold">
                {edgeCount} Lines
              </span>
            </div>
          </div>
        </div>


        {/* Empty State */}
        {(!relationships || relationships.length === 0) && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl border-3 border-indigo-200 text-center">
              <div className="text-6xl mb-4">🌳</div>
              <p className="text-gray-800 font-bold text-lg mb-2">
                Your Family Tree Awaits
              </p>
              <p className="text-sm text-gray-600">
                Add relationships to see beautiful family connections
              </p>
            </div>
          </div>
        )}

        {/* Zoom Controls */}
        <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-2">
          <button
            className="w-8 h-8 bg-white/95 backdrop-blur-md border-2 border-gray-300 rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            onClick={() => {
              const svg = d3.select(svgRef.current);
              const g = svg.select("g");
              const currentTransform = d3.zoomTransform(g.node() as any);
              const newScale = Math.min(currentTransform.k * 1.2, 3);
              g.transition().duration(200).call(
                d3.zoom().transform as any,
                d3.zoomIdentity.translate(currentTransform.x, currentTransform.y).scale(newScale)
              );
            }}
          >
            <span className="text-gray-700 font-bold text-sm">+</span>
          </button>
          <button
            className="w-8 h-8 bg-white/95 backdrop-blur-md border-2 border-gray-300 rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            onClick={() => {
              const svg = d3.select(svgRef.current);
              const g = svg.select("g");
              const currentTransform = d3.zoomTransform(g.node() as any);
              const newScale = Math.max(currentTransform.k * 0.8, 0.3);
              g.transition().duration(200).call(
                d3.zoom().transform as any,
                d3.zoomIdentity.translate(currentTransform.x, currentTransform.y).scale(newScale)
              );
            }}
          >
            <span className="text-gray-700 font-bold text-sm">−</span>
          </button>
          <button
            className="w-8 h-8 bg-white/95 backdrop-blur-md border-2 border-gray-300 rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            onClick={() => {
              const svg = d3.select(svgRef.current);
              const g = svg.select("g");
              const bounds = { x: 0, y: 0, width: dimensions.width - 120, height: dimensions.height - 120 };
              const fullWidth = dimensions.width - 120;
              const fullHeight = dimensions.height - 120;
              const scale = Math.min(fullWidth / bounds.width, fullHeight / bounds.height) * 0.9;
              const translate = [
                fullWidth / 2 - scale * (bounds.x + bounds.width / 2),
                fullHeight / 2 - scale * (bounds.y + bounds.height / 2)
              ];
              
              g.transition().duration(750).call(
                d3.zoom().transform as any,
                d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
              );
            }}
          >
            <span className="text-gray-700 font-bold text-xs">⧉</span>
          </button>
        </div>

        {/* SVG Container */}
        <svg ref={svgRef} className="w-full h-full" style={{ background: 'transparent' }}></svg>
      </div>

      <style jsx>{`
        .dash-animated {
          background: repeating-linear-gradient(
            90deg,
            #f59e0b 0px,
            #f59e0b 4px,
            transparent 4px,
            transparent 8px
          );
          animation: dash-move 1s linear infinite;
        }
        
        @keyframes dash-move {
          0% { background-position: 0 0; }
          100% { background-position: 8px 0; }
        }
      `}</style>
    </div>
  );
}