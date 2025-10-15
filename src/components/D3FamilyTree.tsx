"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  Background,
  Panel,
  useNodesState,
  useEdgesState,
  ConnectionLineType,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { layoutFromMap } from "entitree-flex";
import FamilyTreeNode from "./FamilyTreeNode";

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

const nodeTypes = {
  custom: FamilyTreeNode,
};

const nodeWidth = 200;
const nodeHeight = 160;

const Orientation = {
  Vertical: "vertical",
  Horizontal: "horizontal",
};

const { Top, Bottom, Left, Right } = Position;

export default function D3FamilyTree({
  relationships,
  currentUserId,
  currentUserName,
  onNodeClick,
}: FamilyTreeViewProps) {
  const [nodeCount, setNodeCount] = useState(0);
  const [edgeCount, setEdgeCount] = useState(0);
  const [direction, setDirection] = useState("TB");
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    console.log("🎯 D3FamilyTree received data:");
    console.log("📊 Relationships count:", relationships?.length || 0);
    console.log("📊 Relationships data:", relationships);
    console.log("👤 Current User ID:", currentUserId);
    console.log("👤 Current User Name:", currentUserName);

    if (!relationships || relationships.length === 0) {
      console.log("⚠️ No relationships found - showing only current user");
      renderSingleNode();
      return;
    }

    renderFamilyTree();
  }, [relationships, currentUserId, currentUserName, direction]);

  const renderSingleNode = () => {
    const singleNode = {
      id: currentUserId,
      type: "custom",
      position: { x: 0, y: 0 },
      data: {
        label: currentUserName,
        firstName: currentUserName.split(" ")[0],
        lastName: currentUserName.split(" ").slice(1).join(" ") || "",
        initials: currentUserName
          .split(" ")
          .map((n) => n[0])
          .join(""),
        isCurrentUser: true,
        direction: direction,
        isRoot: true,
        onClick: () => onNodeClick?.(currentUserId),
      },
    };

    setNodes([singleNode]);
    setEdges([]);
    setNodeCount(1);
    setEdgeCount(0);
  };

  const transformToTreeData = () => {
    const personMap = new Map<string, any>();
    let rootId = currentUserId;

    // Add current user
    personMap.set(currentUserId, {
      id: currentUserId,
      name: currentUserName,
      firstName: currentUserName.split(" ")[0],
      lastName: currentUserName.split(" ").slice(1).join(" ") || "",
      initials: currentUserName
        .split(" ")
        .map((n) => n[0])
        .join(""),
      isCurrentUser: true,
      children: [],
      spouses: [],
      siblings: [],
      parents: [],
    });

    // Check if current user appears in any relationships
    const currentUserInRelationships = relationships.filter(
      (rel) =>
        rel.personId1?._id === currentUserId ||
        rel.personId2?._id === currentUserId
    );
    console.log(
      "🔍 Current user found in relationships:",
      currentUserInRelationships.length
    );

    // If current user is not in relationships, we need to create parent-child relationships
    if (currentUserInRelationships.length === 0) {
      console.log(
        "⚠️ Current user not found in relationships - creating parent-child relationships"
      );

      // Add all people from relationships as children of current user
      relationships.forEach((rel) => {
        if (rel.personId1 && rel.personId1._id !== currentUserId) {
          const currentUser = personMap.get(currentUserId);
          if (!currentUser.children.includes(rel.personId1._id)) {
            currentUser.children.push(rel.personId1._id);
            console.log(
              `🔗 Added ${rel.personId1.firstName} as child of current user`
            );
          }
        }
        if (rel.personId2 && rel.personId2._id !== currentUserId) {
          const currentUser = personMap.get(currentUserId);
          if (!currentUser.children.includes(rel.personId2._id)) {
            currentUser.children.push(rel.personId2._id);
            console.log(
              `🔗 Added ${rel.personId2.firstName} as child of current user`
            );
          }
        }
      });
    }

    // Add all people from relationships
    relationships.forEach((rel) => {
      if (rel.personId1 && !personMap.has(rel.personId1._id)) {
        personMap.set(rel.personId1._id, {
          id: rel.personId1._id,
          name: `${rel.personId1.firstName} ${rel.personId1.lastName}`,
          firstName: rel.personId1.firstName || "Unknown",
          lastName: rel.personId1.lastName || "",
          initials: `${rel.personId1.firstName?.[0] || ""}${
            rel.personId1.lastName?.[0] || ""
          }`,
          gothiram: rel.personId1.gothiram,
          nativePlace: rel.personId1.nativePlace,
          profilePicture: rel.personId1.profilePicture,
          isCurrentUser: false,
          children: [],
          spouses: [],
          siblings: [],
          parents: [],
        });
      }

      if (rel.personId2 && !personMap.has(rel.personId2._id)) {
        personMap.set(rel.personId2._id, {
          id: rel.personId2._id,
          name: `${rel.personId2.firstName} ${rel.personId2.lastName}`,
          firstName: rel.personId2.firstName || "Unknown",
          lastName: rel.personId2.lastName || "",
          initials: `${rel.personId2.firstName?.[0] || ""}${
            rel.personId2.lastName?.[0] || ""
          }`,
          gothiram: rel.personId2.gothiram,
          nativePlace: rel.personId2.nativePlace,
          profilePicture: rel.personId2.profilePicture,
          isCurrentUser: false,
          children: [],
          spouses: [],
          siblings: [],
          parents: [],
        });
      }
    });

    // If current user was not in relationships, set parents for their children
    if (currentUserInRelationships.length === 0) {
      const currentUser = personMap.get(currentUserId);
      currentUser.children.forEach((childId) => {
        const child = personMap.get(childId);
        if (child && !child.parents.includes(currentUserId)) {
          child.parents.push(currentUserId);
          console.log(`🔗 Set current user as parent of ${child.name}`);
        }
      });
    }

    // Build relationships
    console.log("🔗 Processing relationships for tree structure:");
    relationships.forEach((rel) => {
      if (!rel.personId1 || !rel.personId2) return;

      const person1 = personMap.get(rel.personId1._id);
      const person2 = personMap.get(rel.personId2._id);

      if (!person1 || !person2) return;

      const relType = rel.relationType.toLowerCase();
      console.log(
        `🔗 Relationship: ${person1.name} ${relType} ${person2.name}`
      );

      if (relType === "spouse") {
        if (!person1.spouses.includes(rel.personId2._id)) {
          person1.spouses.push(rel.personId2._id);
          person2.isSpouse = true;
        }
        if (!person2.spouses.includes(rel.personId1._id)) {
          person2.spouses.push(rel.personId1._id);
          person1.isSpouse = true;
        }
      } else if (relType === "father" || relType === "mother") {
        if (!person1.children.includes(rel.personId2._id)) {
          person1.children.push(rel.personId2._id);
        }
        if (!person2.parents.includes(rel.personId1._id)) {
          person2.parents.push(rel.personId1._id);
        }
      } else if (relType === "son" || relType === "daughter") {
        if (!person1.children.includes(rel.personId2._id)) {
          person1.children.push(rel.personId2._id);
        }
        if (!person2.parents.includes(rel.personId1._id)) {
          person2.parents.push(rel.personId1._id);
        }
      } else if (
        relType === "brother" ||
        relType === "sister" ||
        relType === "sibling"
      ) {
        if (!person1.siblings.includes(rel.personId2._id)) {
          person1.siblings.push(rel.personId2._id);
          person2.isSibling = true;
        }
        if (!person2.siblings.includes(rel.personId1._id)) {
          person2.siblings.push(rel.personId1._id);
          person1.isSibling = true;
        }
      }
    });

    // Find the root of the family tree (person with no parents or oldest generation)
    let actualRootId = currentUserId;

    // Look for someone who has no parents in the relationships
    for (const [id, person] of personMap) {
      if (person.parents.length === 0 && person.children.length > 0) {
        actualRootId = id;
        break;
      }
    }

    // If no clear root found, use the current user
    if (
      actualRootId === currentUserId &&
      personMap.get(currentUserId)?.parents.length > 0
    ) {
      // Current user has parents, so find one of their parents as root
      const currentUser = personMap.get(currentUserId);
      if (currentUser.parents.length > 0) {
        actualRootId = currentUser.parents[0];
      }
    }

    console.log(
      "🌳 Tree root set to:",
      actualRootId,
      personMap.get(actualRootId)?.name
    );

    // Debug: Show the final tree structure
    console.log("🌳 Final tree structure:");
    for (const [id, person] of personMap) {
      console.log(`  ${person.name}:`, {
        parents: person.parents.length,
        children: person.children.length,
        spouses: person.spouses.length,
        siblings: person.siblings.length,
      });
    }

    // Convert to object for entitree
    const treeData: Record<string, any> = {};
    personMap.forEach((person, id) => {
      treeData[id] = person;
    });

    return { treeData, rootId: actualRootId, currentUserInRelationships };
  };

  const layoutElements = (
    tree: Record<string, any>,
    rootId: string,
    dir: string,
    relationships: RelationshipData[],
    currentUserInRelationships: RelationshipData[]
  ) => {
    const isTreeHorizontal = dir === "LR";

    const entitreeSettings = {
      clone: true,
      enableFlex: true,
      firstDegreeSpacing: 50,
      nextAfterAccessor: "spouses",
      nextAfterSpacing: 80,
      nextBeforeAccessor: "siblings",
      nextBeforeSpacing: 80,
      nodeHeight,
      nodeWidth,
      orientation: isTreeHorizontal
        ? Orientation.Horizontal
        : Orientation.Vertical,
      rootX: 0,
      rootY: 0,
      secondDegreeSpacing: 100,
      sourcesAccessor: "parents",
      sourceTargetSpacing: 150,
      targetsAccessor: "children",
    };

    const { nodes: entitreeNodes, rels: entitreeEdges } = layoutFromMap(
      rootId,
      tree,
      entitreeSettings
    );

    const nodes: any[] = [];
    const edges: any[] = [];

    entitreeEdges.forEach((edge) => {
      const sourceNode = edge.source.id;
      const targetNode = edge.target.id;
      const newEdge: any = {};
      newEdge.id = "e" + sourceNode + targetNode;
      newEdge.source = sourceNode;
      newEdge.target = targetNode;
      newEdge.type = "smoothstep";
      newEdge.animated = true;
      newEdge.style = { stroke: "#10b981", strokeWidth: 3 };

      const isTargetSpouse = !!edge.target.isSpouse;
      const isTargetSibling = !!edge.target.isSibling;

      if (isTargetSpouse) {
        newEdge.sourceHandle = isTreeHorizontal ? Bottom : Right;
        newEdge.targetHandle = isTreeHorizontal ? Top : Left;
      } else if (isTargetSibling) {
        newEdge.sourceHandle = isTreeHorizontal ? Top : Left;
        newEdge.targetHandle = isTreeHorizontal ? Bottom : Right;
      } else {
        newEdge.sourceHandle = isTreeHorizontal ? Right : Bottom;
        newEdge.targetHandle = isTreeHorizontal ? Left : Top;
      }

      edges.push(newEdge);
    });

    // Fallback: Create edges directly from original relationships to ensure all connections are visible
    const existingEdgeIds = new Set(edges.map((e) => e.id));

    console.log("🔗 Entitree created edges:", entitreeEdges.length);
    console.log("🔗 Total edges after entitree:", edges.length);
    console.log("🔗 Existing edge IDs:", Array.from(existingEdgeIds));

    // Create fallback edges for any missing relationships
    relationships.forEach((rel) => {
      if (!rel.personId1 || !rel.personId2) return;

      const edgeId1 = `e${rel.personId1._id}${rel.personId2._id}`;
      const edgeId2 = `e${rel.personId2._id}${rel.personId1._id}`;

      // Check if edge already exists
      const edgeExists =
        existingEdgeIds.has(edgeId1) || existingEdgeIds.has(edgeId2);
      console.log(
        `🔍 Checking edge: ${rel.personId1.firstName} -> ${rel.personId2.firstName}`
      );
      console.log(`🔍 Edge IDs: ${edgeId1}, ${edgeId2}`);
      console.log(`🔍 Edge exists: ${edgeExists}`);

      if (!edgeExists) {
        const relType = rel.relationType.toLowerCase();
        let sourceHandle, targetHandle;

        // Determine handle positions based on relationship type
        if (relType === "spouse") {
          sourceHandle = isTreeHorizontal ? Bottom : Right;
          targetHandle = isTreeHorizontal ? Top : Left;
        } else if (
          relType === "brother" ||
          relType === "sister" ||
          relType === "sibling"
        ) {
          sourceHandle = isTreeHorizontal ? Top : Left;
          targetHandle = isTreeHorizontal ? Bottom : Right;
        } else {
          // Parent-child relationships
          if (relType === "father" || relType === "mother") {
            // person1 is parent of person2
            sourceHandle = isTreeHorizontal ? Right : Bottom;
            targetHandle = isTreeHorizontal ? Left : Top;
          } else if (relType === "son" || relType === "daughter") {
            // person2 is parent of person1
            sourceHandle = isTreeHorizontal ? Left : Top;
            targetHandle = isTreeHorizontal ? Right : Bottom;
          } else {
            sourceHandle = isTreeHorizontal ? Right : Bottom;
            targetHandle = isTreeHorizontal ? Left : Top;
          }
        }

        const fallbackEdge = {
          id: edgeId1,
          source: rel.personId1._id,
          target: rel.personId2._id,
          type: "smoothstep",
          animated: true,
          style: { stroke: "#10b981", strokeWidth: 3 },
          sourceHandle,
          targetHandle,
        };

        edges.push(fallbackEdge);
        existingEdgeIds.add(edgeId1);
        console.log(
          `🔗 Added fallback edge: ${rel.personId1.firstName} -> ${rel.personId2.firstName} (${relType})`
        );
      }
    });

    // Special case: Create edges for current user to their children if current user was not in relationships
    if (currentUserInRelationships.length === 0) {
      const currentUser = tree[currentUserId];
      if (currentUser && currentUser.children) {
        currentUser.children.forEach((childId) => {
          const edgeId = `e${currentUserId}${childId}`;
          if (!existingEdgeIds.has(edgeId)) {
            const fallbackEdge = {
              id: edgeId,
              source: currentUserId,
              target: childId,
              type: "smoothstep",
              animated: true,
              style: { stroke: "#10b981", strokeWidth: 3 },
              sourceHandle: isTreeHorizontal ? Right : Bottom,
              targetHandle: isTreeHorizontal ? Left : Top,
            };

            edges.push(fallbackEdge);
            existingEdgeIds.add(edgeId);
            console.log(
              `🔗 Added parent-child edge: ${currentUserName} -> ${tree[childId]?.name}`
            );
          }
        });
      }
    }

    console.log("🔗 Final edge count:", edges.length);
    console.log(
      "🔗 Final edges:",
      edges.map((e) => `${e.source} -> ${e.target}`)
    );

    entitreeNodes.forEach((node) => {
      const isSpouse = !!node?.isSpouse;
      const isSibling = !!node?.isSibling;
      const isRoot = node?.id === rootId;

      const newNode: any = {
        id: node.id,
        type: "custom",
        width: nodeWidth,
        height: nodeHeight,
        position: {
          x: node.x,
          y: node.y,
        },
        data: {
          label: node.name,
          firstName: node.firstName,
          lastName: node.lastName,
          initials: node.initials,
          gothiram: node.gothiram,
          nativePlace: node.nativePlace,
          isCurrentUser: node.isCurrentUser || false,
          isSpouse,
          isSibling,
          isRoot,
          direction: dir,
          children: node.children,
          siblings: node.siblings,
          spouses: node.spouses,
          onClick: () => {
            if (onNodeClick) {
              // Add highlight class
              const cardElements = document.querySelectorAll(".card-inner");
              cardElements.forEach((card) =>
                card.classList.remove("card-clicked")
              );
              setTimeout(() => {
                const clickedCard = document.querySelector(
                  `[data-id="${node.id}"] .card-inner`
                );
                if (clickedCard) {
                  clickedCard.classList.add("card-clicked");
                }
              }, 10);
              onNodeClick(node.id);
            }
          },
        },
      };

      if (isSpouse) {
        newNode.sourcePosition = isTreeHorizontal ? Bottom : Right;
        newNode.targetPosition = isTreeHorizontal ? Top : Left;
      } else if (isSibling) {
        newNode.sourcePosition = isTreeHorizontal ? Top : Left;
        newNode.targetPosition = isTreeHorizontal ? Bottom : Right;
      } else {
        newNode.sourcePosition = isTreeHorizontal ? Right : Bottom;
        newNode.targetPosition = isTreeHorizontal ? Left : Top;
      }

      nodes.push(newNode);
    });

    return { nodes, edges };
  };

  const renderFamilyTree = () => {
    const { treeData, rootId, currentUserInRelationships } =
      transformToTreeData();
    console.log("👥 Transformed tree data:", treeData);
    console.log("🌳 Using root ID:", rootId);

    const { nodes: layoutedNodes, edges: layoutedEdges } = layoutElements(
      treeData,
      rootId,
      direction,
      relationships,
      currentUserInRelationships
    );

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
    setNodeCount(layoutedNodes.length);
    setEdgeCount(layoutedEdges.length);
  };

  const onLayout = useCallback((newDirection: string) => {
    setDirection(newDirection);
  }, []);

  return (
    <div
      className="w-full h-[750px] bg-gradient-to-br from-indigo-50 via-white to-emerald-50 rounded-2xl border-4 border-indigo-200 shadow-2xl overflow-hidden"
      style={{ position: "relative", zIndex: 40 }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        connectionLineType={ConnectionLineType.SmoothStep}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.1}
        maxZoom={2}
        defaultEdgeOptions={{
          type: "smoothstep",
          animated: true,
          style: { stroke: "#10b981", strokeWidth: 3 },
        }}
        proOptions={{ hideAttribution: true }}
      >
        {/* Info Panel */}
        <Panel
          position="top-left"
          className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 backdrop-blur-md p-3 rounded-2xl shadow-2xl border-3 border-white/30"
          style={{ zIndex: 50 }}
        >
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
                {edgeCount} Connections
              </span>
            </div>
          </div>
        </Panel>

        {/* Layout Controls */}
        <Panel position="top-right">
          <div className="flex gap-2">
            <button
              className="px-3 py-1 bg-white rounded-lg shadow-md text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => onLayout("TB")}
            >
              ↕ Vertical
            </button>
            <button
              className="px-3 py-1 bg-white rounded-lg shadow-md text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => onLayout("LR")}
            >
              ↔ Horizontal
            </button>
          </div>
        </Panel>

        <Background />
      </ReactFlow>

      {/* Empty State */}
      {(!relationships || relationships.length === 0) && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
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
    </div>
  );
}
