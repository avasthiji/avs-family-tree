// components/FamilyTree.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  Background,
  Panel,
  useNodesState,
  useEdgesState,
  ConnectionLineType,
  Node,
  Edge,
  Controls,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import FamilyTreeNode from "./FamilyTreeNode";

interface Person {
  _id: string;
  firstName: string;
  lastName: string;
  gothiram?: string;
  nativePlace?: string;
  profilePicture?: string;
}

interface RelationshipData {
  _id: string;
  personId1: Person;
  personId2: Person;
  relationType: string;
  description?: string;
  isApproved: boolean;
  createdBy?: Person;
  createdAt?: string;
  updatedAt?: string;
}

interface FamilyTreeViewProps {
  relationships: RelationshipData[];
  currentUserId: string;
  currentUserName: string;
  onNodeClick?: (userId: string) => void;
}

const nodeTypes = {
  custom: FamilyTreeNode as any,
};

const PARENT_RELATIONS = ["Father", "Mother", "Grand Father", "Grand Mother"];
const CHILD_RELATIONS = ["Son", "Daughter"];
const SIBLING_RELATIONS = [
  "Brother",
  "Sister",
  "Older Sibling",
  "Younger Sibling",
];
const SPOUSE_RELATIONS = ["Spouse"];
const EXTENDED_RELATIONS = [
  "Uncle",
  "Aunt",
  "Cousin",
  "Nephew",
  "Niece",
  "Other",
];

export default function D3FamilyTree({
  relationships,
  currentUserId,
  currentUserName,
  onNodeClick,
}: FamilyTreeViewProps) {
  const [direction, setDirection] = useState<"TB" | "LR">("TB");
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Helper to get full name
  const getFullName = (person: Person) =>
    `${person.firstName} ${person.lastName}`;

  // Helper to get initials
  const getInitials = (person: Person) =>
    `${person.firstName[0]}${person.lastName[0]}`.toUpperCase();

  // Build family structure from relationships
  const buildFamilyStructure = useCallback(() => {
    const people = new Map<string, Person>();
    const parents = new Map<string, string[]>();
    const children = new Map<string, string[]>();
    const spouses = new Map<string, string[]>();
    const siblings = new Map<string, string[]>();
    const extended = new Map<string, Array<{ id: string; type: string }>>();

    // Add current user if not in relationships
    if (!people.has(currentUserId)) {
      people.set(currentUserId, {
        _id: currentUserId,
        firstName: currentUserName.split(" ")[0],
        lastName: currentUserName.split(" ")[1] || "",
      });
    }

    // Process all relationships
    relationships.forEach((rel) => {
      const p1 = rel.personId1;
      const p2 = rel.personId2;

      if (!p1 || !p2) return;

      // Add people to map
      people.set(p1._id, p1);
      people.set(p2._id, p2);

      const relType = rel.relationType;

      // Handle different relationship types based on the semantics:
      // The relationship type describes what personId2 is to personId1
      // e.g., if relationType is "Son", then personId2 is the Son of personId1

      if (PARENT_RELATIONS.includes(relType)) {
        // p2 is the parent (Father/Mother/GrandFather/GrandMother) of p1
        if (!parents.has(p1._id)) parents.set(p1._id, []);
        if (!parents.get(p1._id)!.includes(p2._id)) {
          parents.get(p1._id)!.push(p2._id);
        }
        if (!children.has(p2._id)) children.set(p2._id, []);
        if (!children.get(p2._id)!.includes(p1._id)) {
          children.get(p2._id)!.push(p1._id);
        }
      } else if (CHILD_RELATIONS.includes(relType)) {
        // p2 is the child (Son/Daughter) of p1
        if (!children.has(p1._id)) children.set(p1._id, []);
        if (!children.get(p1._id)!.includes(p2._id)) {
          children.get(p1._id)!.push(p2._id);
        }
        if (!parents.has(p2._id)) parents.set(p2._id, []);
        if (!parents.get(p2._id)!.includes(p1._id)) {
          parents.get(p2._id)!.push(p1._id);
        }
      } else if (SIBLING_RELATIONS.includes(relType)) {
        // p2 is sibling (Brother/Sister) of p1 - bidirectional
        if (!siblings.has(p1._id)) siblings.set(p1._id, []);
        if (!siblings.has(p2._id)) siblings.set(p2._id, []);
        if (!siblings.get(p1._id)!.includes(p2._id)) {
          siblings.get(p1._id)!.push(p2._id);
        }
        if (!siblings.get(p2._id)!.includes(p1._id)) {
          siblings.get(p2._id)!.push(p1._id);
        }
      } else if (SPOUSE_RELATIONS.includes(relType)) {
        // p2 is spouse of p1 - bidirectional
        if (!spouses.has(p1._id)) spouses.set(p1._id, []);
        if (!spouses.has(p2._id)) spouses.set(p2._id, []);
        if (!spouses.get(p1._id)!.includes(p2._id)) {
          spouses.get(p1._id)!.push(p2._id);
        }
        if (!spouses.get(p2._id)!.includes(p1._id)) {
          spouses.get(p2._id)!.push(p1._id);
        }
      } else if (EXTENDED_RELATIONS.includes(relType)) {
        // Extended family - store with type for reference
        if (!extended.has(p1._id)) extended.set(p1._id, []);
        extended.get(p1._id)!.push({ id: p2._id, type: relType });

        if (!extended.has(p2._id)) extended.set(p2._id, []);
        extended.get(p2._id)!.push({ id: p1._id, type: relType });
      }
    });

    return { people, parents, children, spouses, siblings, extended };
  }, [relationships, currentUserId, currentUserName]);

  // Generate nodes and edges for React Flow
  const generateTreeElements = useCallback(() => {
    const { people, parents, children, spouses, siblings, extended } =
      buildFamilyStructure();
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const nodePositions = new Map<
      string,
      { x: number; y: number; level: number }
    >();
    const visited = new Set<string>();

    // Layout configuration
    const nodeWidth = 200;
    const nodeHeight = 160;
    const horizontalSpacing = 280;
    const verticalSpacing = 220;

    // Assign levels to all nodes using BFS from current user
    const assignLevels = () => {
      const queue: { id: string; level: number }[] = [
        { id: currentUserId, level: 0 },
      ];
      visited.add(currentUserId);
      nodePositions.set(currentUserId, { x: 0, y: 0, level: 0 });

      while (queue.length > 0) {
        const { id, level } = queue.shift()!;

        // Add spouses at the same level
        const personSpouses = spouses.get(id) || [];
        personSpouses.forEach((spouseId) => {
          if (!visited.has(spouseId)) {
            visited.add(spouseId);
            nodePositions.set(spouseId, { x: 0, y: 0, level });
            queue.push({ id: spouseId, level });
          }
        });

        // Add siblings at the same level
        const personSiblings = siblings.get(id) || [];
        personSiblings.forEach((siblingId) => {
          if (!visited.has(siblingId)) {
            visited.add(siblingId);
            nodePositions.set(siblingId, { x: 0, y: 0, level });
            queue.push({ id: siblingId, level });
          }
        });

        // Add parents at level - 1
        const personParents = parents.get(id) || [];
        personParents.forEach((parentId) => {
          if (!visited.has(parentId)) {
            visited.add(parentId);
            nodePositions.set(parentId, { x: 0, y: 0, level: level - 1 });
            queue.push({ id: parentId, level: level - 1 });
          }
        });

        // Add children at level + 1
        const personChildren = children.get(id) || [];
        personChildren.forEach((childId) => {
          if (!visited.has(childId)) {
            visited.add(childId);
            nodePositions.set(childId, { x: 0, y: 0, level: level + 1 });
            queue.push({ id: childId, level: level + 1 });
          }
        });

        // Add extended family at appropriate levels
        const personExtended = extended.get(id) || [];
        personExtended.forEach(({ id: extendedId, type }) => {
          if (!visited.has(extendedId)) {
            visited.add(extendedId);
            // Determine level based on relationship type
            let extendedLevel = level;
            if (type === "Uncle" || type === "Aunt") {
              extendedLevel = level - 1; // Same level as parents
            } else if (type === "Nephew" || type === "Niece") {
              extendedLevel = level + 1; // Same level as children
            } else if (type === "Cousin") {
              extendedLevel = level; // Same level as siblings
            }
            nodePositions.set(extendedId, { x: 0, y: 0, level: extendedLevel });
            queue.push({ id: extendedId, level: extendedLevel });
          }
        });
      }

      // Handle any disconnected nodes
      people.forEach((_, id) => {
        if (!visited.has(id)) {
          nodePositions.set(id, { x: 0, y: 0, level: 0 });
        }
      });
    };

    assignLevels();

    // Group nodes by level
    const levels = new Map<number, string[]>();
    nodePositions.forEach((pos, id) => {
      if (!levels.has(pos.level)) {
        levels.set(pos.level, []);
      }
      levels.get(pos.level)!.push(id);
    });

    // Sort levels by level number
    const sortedLevels = Array.from(levels.keys()).sort((a, b) => a - b);

    // Position nodes within each level
    sortedLevels.forEach((level) => {
      const nodeIds = levels.get(level)!;

      // For the current user's level, arrange: spouses (left), current user (center), siblings (right)
      if (nodeIds.includes(currentUserId)) {
        const arrangedNodes: string[] = [];
        const personSpouses = spouses.get(currentUserId) || [];
        const personSiblings = siblings.get(currentUserId) || [];

        // Add spouses first (to the left)
        personSpouses.forEach((spouseId) => {
          if (nodeIds.includes(spouseId) && !arrangedNodes.includes(spouseId)) {
            arrangedNodes.push(spouseId);
          }
        });

        // Add current user in the middle
        arrangedNodes.push(currentUserId);

        // Add siblings (to the right)
        personSiblings.forEach((siblingId) => {
          if (
            nodeIds.includes(siblingId) &&
            !arrangedNodes.includes(siblingId)
          ) {
            arrangedNodes.push(siblingId);
          }
        });

        // Add any remaining nodes in this level
        nodeIds.forEach((id) => {
          if (!arrangedNodes.includes(id)) {
            arrangedNodes.push(id);
          }
        });

        // Position the arranged nodes
        const levelWidth = arrangedNodes.length * horizontalSpacing;
        const startX = -levelWidth / 2 + horizontalSpacing / 2;

        arrangedNodes.forEach((id, index) => {
          const x = startX + index * horizontalSpacing;
          const y = level * verticalSpacing;
          nodePositions.set(id, { x, y, level });
        });
      } else {
        // For other levels (parents above, children below)
        // Group nodes by their family units
        const processedNodes = new Set<string>();
        const familyGroups: string[][] = [];

        nodeIds.forEach((id) => {
          if (processedNodes.has(id)) return;

          const group: string[] = [id];
          processedNodes.add(id);

          // Add spouse to the same group
          const personSpouses = spouses.get(id) || [];
          personSpouses.forEach((spouseId) => {
            if (nodeIds.includes(spouseId) && !processedNodes.has(spouseId)) {
              group.push(spouseId);
              processedNodes.add(spouseId);
            }
          });

          // Add siblings to the same group
          const personSiblings = siblings.get(id) || [];
          personSiblings.forEach((siblingId) => {
            if (nodeIds.includes(siblingId) && !processedNodes.has(siblingId)) {
              group.push(siblingId);
              processedNodes.add(siblingId);
            }
          });

          familyGroups.push(group);
        });

        // Position each family group
        const totalWidth = familyGroups.reduce(
          (sum, group) => sum + group.length * horizontalSpacing,
          0
        );
        let currentX = -totalWidth / 2 + horizontalSpacing / 2;

        familyGroups.forEach((group) => {
          group.forEach((id) => {
            const y = level * verticalSpacing;
            nodePositions.set(id, { x: currentX, y, level });
            currentX += horizontalSpacing;
          });
        });
      }
    });

    // Create nodes
    nodePositions.forEach((pos, id) => {
      const person = people.get(id);
      if (!person) return;

      const isCurrentUser = id === currentUserId;

      nodes.push({
        id,
        type: "custom",
        position: { x: pos.x, y: pos.y },
        data: {
          label: getFullName(person),
          firstName: person.firstName,
          lastName: person.lastName,
          profilePicture: person.profilePicture,
          gothiram: person.gothiram,
          nativePlace: person.nativePlace,
          isCurrentUser,
          onClick: () => onNodeClick?.(id),
        },
      });
    });

    // Create edges for parent-child relationships
    children.forEach((childIds, parentId) => {
      childIds.forEach((childId) => {
        if (nodePositions.has(parentId) && nodePositions.has(childId)) {
          edges.push({
            id: `parent-child-${parentId}-${childId}`,
            source: parentId,
            sourceHandle: "bottom",
            target: childId,
            targetHandle: "top",
            type: "smoothstep",
            style: { stroke: "#10b981", strokeWidth: 2 },
            animated: false,
            label: "child",
            labelStyle: { fontSize: 10, fill: "#10b981" },
            labelBgStyle: { fill: "#fff", fillOpacity: 0.8 },
          });
        }
      });
    });

    // Create edges for spouse relationships
    spouses.forEach((spouseIds, personId) => {
      spouseIds.forEach((spouseId) => {
        if (nodePositions.has(personId) && nodePositions.has(spouseId)) {
          // Only create edge once
          if (personId < spouseId) {
            // Determine which node is on the left/right based on x position
            const person1Pos = nodePositions.get(personId);
            const person2Pos = nodePositions.get(spouseId);
            const isLeftToRight = person1Pos!.x < person2Pos!.x;

            edges.push({
              id: `spouse-${personId}-${spouseId}`,
              source: isLeftToRight ? personId : spouseId,
              sourceHandle: "right",
              target: isLeftToRight ? spouseId : personId,
              targetHandle: "left",
              type: "straight",
              style: {
                stroke: "#ec4899",
                strokeWidth: 2,
                strokeDasharray: "5,5",
              },
              animated: false,
              label: "spouse",
              labelStyle: { fontSize: 10, fill: "#ec4899" },
              labelBgStyle: { fill: "#fff", fillOpacity: 0.8 },
            });
          }
        }
      });
    });

    // Create edges for sibling relationships (only for visualization)
    siblings.forEach((siblingIds, personId) => {
      siblingIds.forEach((siblingId) => {
        if (nodePositions.has(personId) && nodePositions.has(siblingId)) {
          // Only create edge once and only if they are on the same level
          const personPos = nodePositions.get(personId);
          const siblingPos = nodePositions.get(siblingId);

          if (personId < siblingId && personPos?.level === siblingPos?.level) {
            // Determine which node is on the left/right based on x position
            const isLeftToRight = personPos!.x < siblingPos!.x;

            edges.push({
              id: `sibling-${personId}-${siblingId}`,
              source: isLeftToRight ? personId : siblingId,
              sourceHandle: "right",
              target: isLeftToRight ? siblingId : personId,
              targetHandle: "left",
              type: "straight",
              style: {
                stroke: "#f59e0b",
                strokeWidth: 1,
                strokeDasharray: "3,3",
              },
              animated: false,
              label: "sibling",
              labelStyle: { fontSize: 10, fill: "#f59e0b" },
              labelBgStyle: { fill: "#fff", fillOpacity: 0.8 },
            });
          }
        }
      });
    });

    // Create edges for extended family relationships
    extended.forEach((extendedRelations, personId) => {
      extendedRelations.forEach(({ id: extendedId, type }) => {
        if (nodePositions.has(personId) && nodePositions.has(extendedId)) {
          // Only create edge once
          if (personId < extendedId) {
            const person1Pos = nodePositions.get(personId);
            const person2Pos = nodePositions.get(extendedId);

            // Determine if this is a same-level relationship (cousin) or vertical (uncle/nephew)
            const isSameLevel = person1Pos!.level === person2Pos!.level;

            if (isSameLevel) {
              // Same level - use left/right handles
              const isLeftToRight = person1Pos!.x < person2Pos!.x;
              edges.push({
                id: `extended-${personId}-${extendedId}`,
                source: isLeftToRight ? personId : extendedId,
                sourceHandle: "right",
                target: isLeftToRight ? extendedId : personId,
                targetHandle: "left",
                type: "straight",
                style: {
                  stroke: "#8b5cf6",
                  strokeWidth: 1,
                  strokeDasharray: "5,2",
                },
                label: type.toLowerCase(),
                labelStyle: { fontSize: 10, fill: "#8b5cf6" },
                labelBgStyle: { fill: "#fff", fillOpacity: 0.8 },
                animated: false,
              });
            } else {
              // Different levels - use top/bottom handles
              const isTopToBottom = person1Pos!.level < person2Pos!.level;
              edges.push({
                id: `extended-${personId}-${extendedId}`,
                source: isTopToBottom ? personId : extendedId,
                sourceHandle: "bottom",
                target: isTopToBottom ? extendedId : personId,
                targetHandle: "top",
                type: "smoothstep",
                style: {
                  stroke: "#8b5cf6",
                  strokeWidth: 1,
                  strokeDasharray: "5,2",
                },
                label: type.toLowerCase(),
                labelStyle: { fontSize: 10, fill: "#8b5cf6" },
                labelBgStyle: { fill: "#fff", fillOpacity: 0.8 },
                animated: false,
              });
            }
          }
        }
      });
    });

    return { nodes, edges };
  }, [buildFamilyStructure, currentUserId, onNodeClick]);

  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = generateTreeElements();
    setNodes(newNodes);
    setEdges(newEdges);
  }, [relationships, direction, generateTreeElements]);

  return (
    <div className="w-full h-[750px] bg-gradient-to-br from-indigo-50 via-white to-emerald-50 rounded-2xl border-4 border-indigo-200 shadow-xl overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        connectionLineType={ConnectionLineType.SmoothStep}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.2}
        maxZoom={1.5}
      >
        <Panel
          position="top-left"
          className="bg-indigo-600 text-white p-3 rounded-lg shadow-lg"
        >
          <b>🌳 Family Tree</b>
        </Panel>
        <Panel
          position="bottom-left"
          className="bg-white p-3 rounded-lg shadow-lg text-xs"
        >
          <div className="font-bold mb-2">Legend</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-green-500" />
              <span>Parent-Child</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-0.5 bg-pink-500"
                style={{ borderTop: "2px dashed" }}
              />
              <span>Spouse</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-0.5 bg-amber-500"
                style={{ borderTop: "1px dashed" }}
              />
              <span>Sibling</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-0.5 bg-purple-500"
                style={{ borderTop: "1px dashed" }}
              />
              <span>Extended</span>
            </div>
          </div>
        </Panel>
        <Controls className="bg-white shadow-lg" />
        <Background color="#cbd5e1" gap={32} size={1} />
      </ReactFlow>
    </div>
  );
}
