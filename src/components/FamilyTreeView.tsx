"use client";

import { useEffect, useMemo, useState } from "react";
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
} from "reactflow";
import "reactflow/dist/style.css";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock } from "lucide-react";
import { hierarchy, tree as d3Tree } from "d3-hierarchy";

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

/* ---------------------------
   Custom node component
   --------------------------- */
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
          <Badge
            variant="outline"
            className="text-[#E63946] border-[#E63946] text-xs"
          >
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

/* ---------------------------
   Utility sets for relation semantics
   --------------------------- */
const PARENT_TYPES = new Set([
  "Father",
  "Mother",
  "Grand Father",
  "Grand Mother",
  "Uncle",
  "Aunt",
]);
const CHILD_TYPES = new Set(["Son", "Daughter", "Nephew", "Niece"]);
const SAME_LEVEL_TYPES = new Set([
  "Spouse",
  "Brother",
  "Sister",
  "Older Sibling",
  "Younger Sibling",
  "Cousin",
  "Sibling",
]);

/* ---------------------------
   Main component
   --------------------------- */
export default function FamilyTreeView({
  relationships,
  currentUserId,
  currentUserName,
}: FamilyTreeViewProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);

  /**
   * Build a map of personId -> person object (collecting all participants)
   */
  const personMap = useMemo(() => {
    const m = new Map<string, any>();
    // ensure current user exists
    m.set(currentUserId, {
      _id: currentUserId,
      firstName: currentUserName.split(" ")[0],
      lastName: currentUserName.split(" ").slice(1).join(" ") || "",
      profilePicture: undefined,
    });

    (relationships || []).forEach((rel) => {
      if (rel.personId1 && rel.personId1._id && !m.has(rel.personId1._id)) {
        m.set(rel.personId1._id, rel.personId1);
      }
      if (rel.personId2 && rel.personId2._id && !m.has(rel.personId2._id)) {
        m.set(rel.personId2._id, rel.personId2);
      }
    });

    return m;
  }, [relationships, currentUserId, currentUserName]);

  /**
   * Build relationship graph: personId -> list of { person, type, relId, approved }
   */
  const relationshipGraph = useMemo(() => {
    const g = new Map<
      string,
      Array<{ person: any; type: string; relId: string; approved: boolean }>
    >();
    (relationships || []).forEach((rel) => {
      if (!rel.personId1 || !rel.personId2) return;
      const a = rel.personId1._id;
      const b = rel.personId2._id;

      if (!g.has(a)) g.set(a, []);
      if (!g.has(b)) g.set(b, []);

      g.get(a)!.push({
        person: rel.personId2,
        type: rel.relationType,
        relId: rel._id,
        approved: rel.isApproved,
      });
      g.get(b)!.push({
        person: rel.personId1,
        type: rel.relationType,
        relId: rel._id,
        approved: rel.isApproved,
      });
    });
    return g;
  }, [relationships]);

  /**
   * Build family tree with proper relationship mapping and edge drawing
   */
  useEffect(() => {
    // short-circuit: no people at all
    if (!personMap || personMap.size === 0) {
      setNodes([]);
      setEdges([]);
      return;
    }

    // if there are no relationships, show only current user as a node
    if (!relationships || relationships.length === 0) {
      const singleNode: Node = {
        id: currentUserId,
        type: "familyMember",
        position: { x: 800, y: 400 },
        data: {
          name: currentUserName,
          initials: currentUserName
            .split(" ")
            .map((n) => n[0])
            .join(""),
          isCurrentUser: true,
        },
      };
      setNodes([singleNode]);
      setEdges([]);
      return;
    }

    // --- 1. Generations via BFS (heuristics) ---
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

        // Adjusted relationship direction handling
        if (PARENT_TYPES.has(type)) {
          // The related person is the parent
          if (pid === currentUserId) {
            // current user → parent → generation above
            targetGen = curGen - 1;
          } else {
            // generic parent relationship
            targetGen = curGen - 1;
          }
        } else if (CHILD_TYPES.has(type)) {
          // The related person is the child
          targetGen = curGen + 1;
        } else if (SAME_LEVEL_TYPES.has(type)) {
          // spouse or sibling — same level
          targetGen = curGen;
        } else {
          // fallback for undefined relationship types
          targetGen = curGen;
        }

        generations.set(nid, targetGen);
        visited.add(nid);
        queue.push(nid);
      });
    }

    // Ensure everyone gets a generation (if some disconnected nodes exist)
    Array.from(personMap.keys()).forEach((pid) => {
      if (!generations.has(pid)) {
        generations.set(pid, 1); // place disconnected nodes below root
      }
    });

    // --- 2. Choose parent for each node (to form a tree) ---
    // root is currentUserId
    const parentOf = new Map<string, string | null>();
    parentOf.set(currentUserId, null);

    // for deterministic order prefer nodes closer to root by absolute generation
    const sortedPeople = Array.from(generations.entries()).sort((a, b) => {
      const genDiff = Math.abs(a[1]) - Math.abs(b[1]);
      if (genDiff !== 0) return genDiff;
      return a[0].localeCompare(b[0]);
    });

    sortedPeople.forEach(([pid, gen]) => {
      if (pid === currentUserId) return;
      // find neighbors of pid with generation = gen - 1 (parents)
      const neigh = relationshipGraph.get(pid) || [];
      const parentCandidate = neigh.find(
        (n) => (generations.get(n.person._id) || 0) === gen - 1
      );

      if (parentCandidate) {
        parentOf.set(pid, parentCandidate.person._id);
      } else {
        // fallback: pick any neighbor with smaller generation than current
        const smaller = neigh.find(
          (n) => (generations.get(n.person._id) || 0) < gen
        );
        if (smaller) parentOf.set(pid, smaller.person._id);
        else {
          // ultimate fallback: attach to currentUser
          parentOf.set(pid, currentUserId);
        }
      }
    });

    // --- 3. Build hierarchical tree structure ---
    // We will create nodes by id and then attach children using parentOf map
    const treeNodes = new Map<string, any>(); // rudimentary node objects with children

    personMap.forEach((person, id) => {
      treeNodes.set(id, {
        id,
        person,
        children: [] as any[],
      });
    });

    treeNodes.forEach((n, id) => {
      const p = parentOf.get(id);
      if (p && treeNodes.has(p)) {
        treeNodes.get(p).children.push(n);
      }
    });

    // root object (current user)
    const rootNode = treeNodes.get(currentUserId) || {
      id: currentUserId,
      person: personMap.get(currentUserId),
      children: [],
    };

    // --- 4. Use d3.hierarchy and d3.tree to compute positions ---
    const d3Root = hierarchy(rootNode, (d: any) => d.children);
    const layout = d3Tree();

    // Choose node size (this controls spacing). Tune as needed.
    // Using nodeSize gives fine-grained control; alternatively, use .size([...]) for full width/height.
    const NODE_WIDTH = 280;
    const NODE_HEIGHT = 300; // was 220 before — more vertical space to make the line visible
    layout.nodeSize([NODE_WIDTH, NODE_HEIGHT])(d3Root);

    // d3 tree yields x and y values where x is horizontal coordinate and y is vertical coordinate.
    // We'll translate those into ReactFlow positions. Optionally center the layout.
    // Compute bounding box to center the tree in a canvas area.
    let minX = Infinity,
      maxX = -Infinity,
      minY = Infinity,
      maxY = -Infinity;
    d3Root.each((d: any) => {
      if (d.x < minX) minX = d.x;
      if (d.x > maxX) maxX = d.x;
      if (d.y < minY) minY = d.y;
      if (d.y > maxY) maxY = d.y;
    });

    // spacing offsets (center the tree)
    const CANVAS_CENTER_X = 900; // tweak depending on how you embed reactflow
    const CANVAS_CENTER_Y = 200;
    const treeWidth = maxX - minX || NODE_WIDTH;
    const treeHeight = maxY - minY || NODE_HEIGHT;

    // We'll map d3.x,d3.y to flowX, flowY
    const xOffset = CANVAS_CENTER_X - (minX + treeWidth / 2);
    const yOffset = CANVAS_CENTER_Y - (minY + treeHeight / 2);

    const finalNodes: Node[] = [];
    d3Root.each((d: any) => {
      const tid = d.data.id;
      const p = d.data.person;
      const name =
        `${p.firstName || ""}${p.lastName ? " " + p.lastName : ""}`.trim() ||
        "Unknown";
      const initials = (p.firstName?.[0] || "") + (p.lastName?.[0] || "");
      const node: Node = {
        id: tid,
        type: "familyMember",
        position: {
          x: d.x + xOffset,
          y: d.y + yOffset,
        },
        data: {
          name,
          initials,
          profilePicture: p.profilePicture,
          gothiram: p.gothiram,
          nativePlace: p.nativePlace,
          isCurrentUser: tid === currentUserId,
          relationshipType: undefined,
        },
        // keep nodes draggable
        draggable: true,
      };
      finalNodes.push(node);
    });

    // --- 5. Build edges from relationships ---
    const edgeSet = new Set<string>();
    const finalEdges: Edge[] = [];

    (relationships || []).forEach((rel) => {
      if (!rel.personId1 || !rel.personId2) {
        return;
      }

      const a = rel.personId1._id;
      const b = rel.personId2._id;

      // Check if both nodes exist in our final nodes
      const nodeAExists = finalNodes.some((node) => node.id === a);
      const nodeBExists = finalNodes.some((node) => node.id === b);

      if (!nodeAExists || !nodeBExists) {
        return;
      }

      const genA = generations.get(a) ?? 0;
      const genB = generations.get(b) ?? 0;

      // Determine source and target based on generation
      let source = a;
      let target = b;
      if (genA > genB) {
        source = b;
        target = a;
      } else if (genA === genB) {
        // same generation -> keep order deterministic
        source = a < b ? a : b;
        target = a < b ? b : a;
      }

      // Check for duplicates
      const key = `${source}-${target}`;
      const reverseKey = `${target}-${source}`;
      if (edgeSet.has(key) || edgeSet.has(reverseKey)) {
        return;
      }
      edgeSet.add(key);

      const edge: Edge = {
        id: rel._id,
        source,
        target,
        type: "smoothstep",
        animated: false,
        style: {
          stroke: rel.isApproved ? "#10b981" : "#f59e0b",
          strokeWidth: 6,
          strokeLinecap: "round",
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: rel.isApproved ? "#10b981" : "#f59e0b",
          width: 25,
          height: 25,
        },
        label: rel.relationType,
        labelStyle: {
          fill: "#000000",
          fontSize: 14,
          fontWeight: 800,
        },
        labelBgStyle: {
          fill: "#ffffff",
          fillOpacity: 1,
        },
        zIndex: 1000,
      };

      finalEdges.push(edge);
    });

    // --- 6. Apply nodes & edges to reactflow state ---
    setNodes(finalNodes);
    setEdges(finalEdges);
  }, [
    relationships,
    currentUserId,
    currentUserName,
    personMap,
    relationshipGraph,
    setNodes,
    setEdges,
  ]);

  return (
    <div className="w-full h-[820px] bg-gradient-to-br from-indigo-50 via-white to-emerald-50 rounded-2xl border-4 border-indigo-200 shadow-2xl overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{
          padding: 0.15,
          includeHiddenNodes: false,
          minZoom: 0.35,
          maxZoom: 1.8,
        }}
        minZoom={0.25}
        maxZoom={3}
        defaultViewport={{ x: 0, y: 0, zoom: 0.85 }}
        proOptions={{ hideAttribution: true }}
        edgesUpdatable={false}
        edgesFocusable={true}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
        connectionLineStyle={{
          stroke: "#10b981",
          strokeWidth: 4,
        }}
        defaultEdgeOptions={{
          type: "smoothstep",
          animated: false,
          style: {
            strokeWidth: 6,
            stroke: "#10b981",
            strokeLinecap: "round",
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
          style={{ backgroundColor: "transparent" }}
        />
        <Controls
          showInteractive={false}
          className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl"
        />

        <Panel
          position="top-right"
          className="bg-gradient-to-br from-white via-indigo-50 to-white backdrop-blur-md p-5 rounded-2xl shadow-2xl border-3 border-indigo-200"
        >
          <div className="space-y-3">
            <h3 className="font-bold text-base text-indigo-900 mb-1 flex items-center gap-2">
              <span className="text-lg">📊</span> Connection Status
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

        <Panel
          position="top-left"
          className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-4 rounded-2xl shadow-2xl border-3 border-white/30"
        >
          <div className="text-white">
            <h3 className="font-bold text-base mb-2 flex items-center gap-2">
              <span className="text-xl">🌳</span> Family Tree
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
          <Panel
            position="top-center"
            className="bg-white/95 p-6 rounded-2xl shadow-2xl border-3 border-indigo-200"
          >
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
