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

export default function D3FamilyTree({ relationships, currentUserId, currentUserName }: FamilyTreeViewProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [nodeCount, setNodeCount] = useState(0);
  const [edgeCount, setEdgeCount] = useState(0);

  useEffect(() => {
    console.log('🎯 D3FamilyTree received data:');
    console.log('📊 Relationships count:', relationships?.length || 0);
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
      .attr("transform", `translate(${x}, ${y})`);

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

    return nodeGroup;
  };

  const createLink = (container: d3.Selection<SVGGElement, unknown, null, undefined>, 
                     source: {x: number, y: number}, 
                     target: {x: number, y: number}, 
                     relationshipType: string, 
                     isApproved: boolean) => {
    
    const linkGroup = container.append("g")
      .attr("class", "link");

    // Draw the line (matching FamilyTreeView style)
    linkGroup.append("line")
      .attr("x1", source.x)
      .attr("y1", source.y)
      .attr("x2", target.x)
      .attr("y2", target.y)
      .attr("stroke", isApproved ? "#10b981" : "#f59e0b")
      .attr("stroke-width", isApproved ? 6 : 4)
      .attr("stroke-dasharray", isApproved ? "0" : "8,4")
      .attr("stroke-linecap", "round")
      .attr("opacity", 0.9);

    // Add arrowhead for parent-to-child direction (matching FamilyTreeView style)
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const unitX = dx / length;
    const unitY = dy / length;
    
    const arrowSize = 15; // Larger arrow to match FamilyTreeView
    const arrowX = target.x - unitX * 30; // Position arrow 30px from target
    const arrowY = target.y - unitY * 30;

    linkGroup.append("path")
      .attr("d", `M ${arrowX - arrowSize} ${arrowY - arrowSize} L ${arrowX} ${arrowY} L ${arrowX - arrowSize} ${arrowY + arrowSize}`)
      .attr("fill", isApproved ? "#10b981" : "#f59e0b")
      .attr("stroke", "none");

    // Add relationship type label (matching FamilyTreeView style)
    const midX = (source.x + target.x) / 2;
    const midY = (source.y + target.y) / 2;
    
    // Background for label
    linkGroup.append("rect")
      .attr("x", midX - 30)
      .attr("y", midY - 15)
      .attr("width", 60)
      .attr("height", 20)
      .attr("rx", 4)
      .attr("fill", "#ffffff")
      .attr("opacity", 0.95)
      .attr("stroke", isApproved ? "#10b981" : "#f59e0b")
      .attr("stroke-width", 1);
    
    linkGroup.append("text")
      .attr("x", midX)
      .attr("y", midY - 5)
      .attr("text-anchor", "middle")
      .attr("fill", "#000000")
      .attr("font-size", "14")
      .attr("font-weight", "800")
      .text(relationshipType);

    return linkGroup;
  };

  const renderFamilyTree = () => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = dimensions.width;
    const height = dimensions.height;
    const margin = { top: 60, right: 60, bottom: 60, left: 60 };

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

    // Create nodes and links
    const nodes: TreeNode[] = [];
    const links: Array<{source: TreeNode, target: TreeNode, relationshipType: string, isApproved: boolean}> = [];

    // Position current user in center top
    const centerX = contentWidth / 2;
    const currentUserNode: TreeNode = {
      id: currentUserId,
      name: currentUserName,
      firstName: currentUserName.split(' ')[0],
      lastName: currentUserName.split(' ').slice(1).join(' ') || '',
      initials: currentUserName.split(' ').map(n => n[0]).join(''),
      isCurrentUser: true,
      x: centerX,
      y: 100
    };
    nodes.push(currentUserNode);

    // Process relationships to find children
    const children: TreeNode[] = [];
    
    relationships.forEach(rel => {
      console.log('🔍 Processing relationship:', rel);
      
      let childPerson = null;
      let relationshipFromPerspective = rel.relationType;

      // Determine if this is a parent-child relationship from current user's perspective
      if (rel.personId1?._id === currentUserId) {
        childPerson = rel.personId2;
        // Current user is parent, other is child (Son/Daughter)
        relationshipFromPerspective = rel.relationType;
      } else if (rel.personId2?._id === currentUserId) {
        childPerson = rel.personId1;
        // Current user is child, other is parent - reverse the relationship
        relationshipFromPerspective = getReverseRelationship(rel.relationType);
      }

      if (childPerson && isChildRelationship(relationshipFromPerspective)) {
        console.log(`✅ Found child: ${childPerson.firstName} ${childPerson.lastName}`);
        
        const childNode: TreeNode = {
          id: childPerson._id,
          name: `${childPerson.firstName} ${childPerson.lastName}`,
          firstName: childPerson.firstName,
          lastName: childPerson.lastName,
          initials: `${childPerson.firstName?.[0] || ''}${childPerson.lastName?.[0] || ''}`,
          profilePicture: childPerson.profilePicture,
          gothiram: childPerson.gothiram,
          nativePlace: childPerson.nativePlace,
          isCurrentUser: false,
          relationshipType: rel.relationType,
          isApproved: rel.isApproved
        };
        
        children.push(childNode);
        
        // Create link from current user to child
        links.push({
          source: currentUserNode,
          target: childNode,
          relationshipType: rel.relationType,
          isApproved: rel.isApproved
        });
      }
    });

    // Position children horizontally below current user (matching FamilyTreeView spacing)
    const childSpacing = Math.min(280, contentWidth / Math.max(1, children.length));
    const startX = centerX - ((children.length - 1) * childSpacing) / 2;

    children.forEach((child, index) => {
      child.x = startX + index * childSpacing;
      child.y = 350; // Position below current user with proper spacing
      nodes.push(child);
    });

    console.log('📊 Final nodes:', nodes.length);
    console.log('🔗 Final links:', links.length);

    setNodeCount(nodes.length);
    setEdgeCount(links.length);

    // Draw links first (behind nodes)
    links.forEach(link => {
      if (link.source.x !== undefined && link.source.y !== undefined && 
          link.target.x !== undefined && link.target.y !== undefined) {
        createLink(g, 
          { x: link.source.x, y: link.source.y + 80 }, // Start from bottom of parent node
          { x: link.target.x, y: link.target.y - 80 }, // End at top of child node
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
    const bounds = { 
      x: 0, 
      y: 0, 
      width: contentWidth, 
      height: Math.max(contentHeight, 400) 
    };
    
    const fullWidth = width - margin.left - margin.right;
    const fullHeight = height - margin.top - margin.bottom;
    const scale = Math.min(fullWidth / bounds.width, fullHeight / bounds.height) * 0.9;
    const translate = [
      fullWidth / 2 - scale * (bounds.x + bounds.width / 2),
      fullHeight / 2 - scale * (bounds.y + bounds.height / 2)
    ];
    
    g.transition().duration(750).call(
      zoom.transform as any,
      d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
    );
  };

  // Helper function to reverse relationship perspective
  const getReverseRelationship = (relationType: string): string => {
    const reverseMap: { [key: string]: string } = {
      'Father': 'Son',
      'Mother': 'Daughter',
      'Son': 'Father',
      'Daughter': 'Mother',
      'Grand Father': 'Grand Son',
      'Grand Mother': 'Grand Daughter',
    };
    return reverseMap[relationType] || relationType;
  };

  // Helper function to check if relationship is child relationship
  const isChildRelationship = (relationType: string): boolean => {
    return ['Son', 'Daughter', 'Grand Son', 'Grand Daughter'].includes(relationType);
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

        {/* Connection Status Panel */}
        <div className="absolute top-4 right-4 z-10 bg-white backdrop-blur-md p-4 rounded-2xl shadow-2xl border-2 border-gray-200">
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-gray-900 mb-2 flex items-center gap-2">
              <span className="text-sm">📊</span>
              Connection Status
            </h3>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-1.5 bg-green-500 rounded-full shadow-md"></div>
              <span className="text-gray-800 font-semibold">Approved</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-1.5 bg-amber-500 rounded-full shadow-md dash-animated"></div>
              <span className="text-gray-800 font-semibold">Pending</span>
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