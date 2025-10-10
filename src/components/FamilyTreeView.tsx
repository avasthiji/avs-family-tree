"use client";

import { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Panel,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

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

// Custom node component
const FamilyMemberNode = ({ data }: any) => {
  return (
    <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200 p-4 min-w-[200px] hover:shadow-xl transition-shadow">
      <div className="flex flex-col items-center gap-3">
        <Avatar className="h-16 w-16 border-4 border-white shadow-md">
          <AvatarImage src={data.profilePicture} />
          <AvatarFallback className="avs-gradient text-white text-lg">
            {data.initials}
          </AvatarFallback>
        </Avatar>
        
        <div className="text-center">
          <p className="font-bold text-gray-900 text-sm">{data.name}</p>
          {data.gothiram && (
            <p className="text-xs text-gray-600 mt-1">{data.gothiram}</p>
          )}
          {data.nativePlace && (
            <p className="text-xs text-gray-500">{data.nativePlace}</p>
          )}
        </div>

        {data.isCurrentUser && (
          <Badge className="bg-blue-100 text-blue-800 text-xs">You</Badge>
        )}
        
        {data.relationshipType && (
          <Badge variant="outline" className="text-[#E63946] border-[#E63946] text-xs">
            {data.relationshipType}
          </Badge>
        )}
      </div>
    </div>
  );
};

const nodeTypes = {
  familyMember: FamilyMemberNode,
};

export default function FamilyTreeView({ relationships, currentUserId, currentUserName }: FamilyTreeViewProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    console.log('🎯 FamilyTreeView received data:');
    console.log('📊 Relationships count:', relationships?.length || 0);
    console.log('👤 Current User ID:', currentUserId);
    console.log('👤 Current User Name:', currentUserName);
    console.log('📋 Relationships:', relationships);

    if (!relationships || relationships.length === 0) {
      console.log('⚠️  No relationships found - showing only current user');
      const currentUserNode: Node = {
        id: currentUserId,
        type: 'familyMember',
        position: { x: 600, y: 400 },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
        data: {
          name: currentUserName,
          initials: currentUserName.split(' ').map(n => n[0]).join(''),
          isCurrentUser: true,
        },
      };
      setNodes([currentUserNode]);
      setEdges([]);
      return;
    }

    // Build person map
    const personMap = new Map<string, any>();
    const nodeMap = new Map<string, Node>();
    const edgeList: Edge[] = [];

    // Ensure current user is always in the person map
    personMap.set(currentUserId, {
      _id: currentUserId,
      firstName: currentUserName.split(' ')[0],
      lastName: currentUserName.split(' ').slice(1).join(' ') || '',
    });

    // Collect all unique people from relationships
    relationships.forEach(rel => {
      if (rel.personId1 && !personMap.has(rel.personId1._id)) {
        personMap.set(rel.personId1._id, rel.personId1);
      }
      if (rel.personId2 && !personMap.has(rel.personId2._id)) {
        personMap.set(rel.personId2._id, rel.personId2);
      }
    });

    console.log('👥 Total unique people found:', personMap.size);
    console.log('👥 People:', Array.from(personMap.keys()));

    // Build relationship graph
    const relationshipGraph = new Map<string, Array<{person: any, type: string, relId: string, approved: boolean}>>();
    
    relationships.forEach(rel => {
      if (!rel.personId1 || !rel.personId2) return;
      
      // Add both directions
      if (!relationshipGraph.has(rel.personId1._id)) {
        relationshipGraph.set(rel.personId1._id, []);
      }
      if (!relationshipGraph.has(rel.personId2._id)) {
        relationshipGraph.set(rel.personId2._id, []);
      }
      
      relationshipGraph.get(rel.personId1._id)!.push({
        person: rel.personId2,
        type: rel.relationType,
        relId: rel._id,
        approved: rel.isApproved
      });
      
      relationshipGraph.get(rel.personId2._id)!.push({
        person: rel.personId1,
        type: rel.relationType,
        relId: rel._id,
        approved: rel.isApproved
      });
    });

    // Generation layout
    const generations = new Map<string, number>();
    const positionsInGen = new Map<number, number>();
    
    // Set current user as generation 0 (middle)
    generations.set(currentUserId, 0);
    
    // BFS to assign generations
    const queue: string[] = [currentUserId];
    const visited = new Set<string>();
    visited.add(currentUserId);
    
    while (queue.length > 0) {
      const personId = queue.shift()!;
      const currentGen = generations.get(personId) || 0;
      const connections = relationshipGraph.get(personId) || [];
      
      connections.forEach(({ person, type }) => {
        if (visited.has(person._id)) return;
        visited.add(person._id);
        
        let targetGen = currentGen;
        
        // Determine generation based on relationship
        if (['Father', 'Mother'].includes(type)) {
          targetGen = currentGen - 1;
        } else if (['Grand Father', 'Grand Mother'].includes(type)) {
          targetGen = currentGen - 2;
        } else if (['Son', 'Daughter'].includes(type)) {
          targetGen = currentGen + 1;
        } else if (['Spouse'].includes(type)) {
          targetGen = currentGen;
        } else if (['Brother', 'Sister', 'Sibling', 'Older Sibling', 'Younger Sibling'].includes(type)) {
          targetGen = currentGen;
        } else if (['Uncle', 'Aunt'].includes(type)) {
          targetGen = currentGen - 1;
        } else if (['Nephew', 'Niece'].includes(type)) {
          targetGen = currentGen + 1;
        } else if (['Cousin'].includes(type)) {
          targetGen = currentGen;
        }
        
        generations.set(person._id, targetGen);
        queue.push(person._id);
      });
    }
    
    // Create nodes with proper positioning
    const generationMembers = new Map<number, string[]>();
    
    generations.forEach((gen, personId) => {
      if (!generationMembers.has(gen)) {
        generationMembers.set(gen, []);
      }
      generationMembers.get(gen)!.push(personId);
    });
    
    // Position nodes
    const HORIZONTAL_SPACING = 280;
    const VERTICAL_SPACING = 220;
    const CENTER_X = 700;
    const CENTER_Y = 400;
    
    generationMembers.forEach((members, gen) => {
      const totalWidth = (members.length - 1) * HORIZONTAL_SPACING;
      const startX = CENTER_X - (totalWidth / 2);
      
      members.forEach((personId, index) => {
        const person = personId === currentUserId ? 
          { _id: currentUserId, firstName: currentUserName.split(' ')[0], lastName: currentUserName.split(' ')[1] || '' } :
          personMap.get(personId);
        
        if (!person) return;
        
        const node: Node = {
          id: personId,
          type: 'familyMember',
          position: {
            x: startX + (index * HORIZONTAL_SPACING),
            y: CENTER_Y + (gen * VERTICAL_SPACING)
          },
          sourcePosition: Position.Bottom,
          targetPosition: Position.Top,
          data: {
            name: `${person.firstName} ${person.lastName}`,
            initials: `${person.firstName?.[0] || ''}${person.lastName?.[0] || ''}`,
            profilePicture: person.profilePicture,
            gothiram: person.gothiram,
            nativePlace: person.nativePlace,
            isCurrentUser: personId === currentUserId,
          },
        };
        nodeMap.set(personId, node);
      });
    });
    
    // Create edges for ALL relationships (no filtering)
    const edgeSet = new Set<string>();
    
    relationships.forEach(rel => {
      if (!rel.personId1 || !rel.personId2) {
        console.log('❌ Skipping relationship - missing person:', rel);
        return;
      }
      
      if (!nodeMap.has(rel.personId1._id)) {
        console.log('❌ Person1 not in nodes:', rel.personId1._id);
        return;
      }
      
      if (!nodeMap.has(rel.personId2._id)) {
        console.log('❌ Person2 not in nodes:', rel.personId2._id);
        return;
      }
      
      const gen1 = generations.get(rel.personId1._id) || 0;
      const gen2 = generations.get(rel.personId2._id) || 0;
      
      // Determine source and target based on generation
      let source = rel.personId1._id;
      let target = rel.personId2._id;
      
      // Parent (lower gen number) should be source
      if (gen1 > gen2) {
        source = rel.personId2._id;
        target = rel.personId1._id;
      }
      
      // Check for duplicates
      const edgeKey = `${source}-${target}`;
      const reverseKey = `${target}-${source}`;
      if (edgeSet.has(edgeKey) || edgeSet.has(reverseKey)) {
        console.log('⏭️  Skipping duplicate edge:', edgeKey);
        return;
      }
      edgeSet.add(edgeKey);
      
      const edge: Edge = {
        id: rel._id,
        source,
        target,
        type: 'smoothstep',
        animated: false,
        style: { 
          stroke: '#10b981',
          strokeWidth: 6,
          strokeLinecap: 'round',
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#10b981',
          width: 30,
          height: 30,
        },
        label: rel.relationType,
        labelStyle: { 
          fill: '#000000',
          fontSize: 14,
          fontWeight: 800,
        },
        labelBgStyle: {
          fill: '#ffffff',
          fillOpacity: 1,
        },
        zIndex: 1000,
      };
      
      console.log(`✅ Creating edge: ${source} → ${target} (${rel.relationType})`);
      edgeList.push(edge);
    });

    const finalNodes = Array.from(nodeMap.values());
    
    console.log('🌳 Family Tree Debug:');
    console.log('📊 Nodes created:', finalNodes.length);
    console.log('🔗 Edges created:', edgeList.length);
    console.log('📋 Edges:', edgeList.map(e => ({ 
      id: e.id, 
      source: e.source, 
      target: e.target, 
      type: e.type 
    })));
    
    setNodes(finalNodes);
    setEdges(edgeList);
  }, [relationships, currentUserId, currentUserName, setNodes, setEdges]);

  return (
    <div className="w-full h-[750px] bg-gradient-to-br from-indigo-50 via-white to-emerald-50 rounded-2xl border-4 border-indigo-200 shadow-2xl overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{
          padding: 0.2,
          includeHiddenNodes: false,
          minZoom: 0.4,
          maxZoom: 1.5,
        }}
        minZoom={0.3}
        maxZoom={2.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        proOptions={{ hideAttribution: true }}
        edgesUpdatable={false}
        edgesFocusable={false}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
        connectionLineStyle={{ 
          stroke: '#10b981',
          strokeWidth: 4
        }}
        defaultEdgeOptions={{
          type: 'default',
          animated: false,
          style: { 
            strokeWidth: 5,
            stroke: '#10b981',
            strokeLinecap: 'round',
          },
          zIndex: 1000,
        }}
        elevateEdgesOnSelect={true}
        selectNodesOnDrag={false}
      >
        <Background 
          color="#cbd5e1" 
          gap={24} 
          size={2}
          style={{ backgroundColor: 'transparent' }}
        />
        <Controls 
          showInteractive={false}
          className="bg-white/95 backdrop-blur-md border-3 border-indigo-300 rounded-2xl shadow-2xl"
        />
        
        <Panel position="top-right" className="bg-gradient-to-br from-white via-indigo-50 to-white backdrop-blur-md p-5 rounded-2xl shadow-2xl border-3 border-indigo-200">
          <div className="space-y-4">
            <h3 className="font-bold text-base text-indigo-900 mb-3 flex items-center gap-2">
              <span className="text-lg">📊</span>
              Connection Status
            </h3>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-1.5 bg-green-500 rounded-full shadow-md"></div>
              <span className="text-gray-800 font-semibold">Approved</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-1.5 bg-amber-500 rounded-full animate-pulse shadow-md"></div>
              <span className="text-gray-800 font-semibold">Pending</span>
            </div>
          </div>
        </Panel>

        <Panel position="top-left" className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 backdrop-blur-md p-4 rounded-2xl shadow-2xl border-3 border-white/30">
          <div className="text-white">
            <h3 className="font-bold text-base mb-2 flex items-center gap-2">
              <span className="text-xl">🌳</span>
              Family Tree
            </h3>
            <div className="flex items-center gap-4 text-sm">
              <span className="bg-white/20 px-3 py-1 rounded-full font-semibold">
                {nodes.length} Members
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full font-semibold">
                {edges.length} Lines
              </span>
            </div>
          </div>
        </Panel>

        {nodes.length === 0 && (
          <Panel position="top-center" className="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl border-3 border-indigo-200">
            <div className="text-center">
              <div className="text-6xl mb-4">🌳</div>
              <p className="text-gray-800 font-bold text-lg mb-2">
                Your Family Tree Awaits
              </p>
              <p className="text-sm text-gray-600">
                Add relationships to see beautiful family connections
              </p>
            </div>
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
}

