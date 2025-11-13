import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Relationship from "@/models/Relationship";
import User from "@/models/User";

export const runtime = "nodejs";

interface HierarchicalPerson {
  id: string;
  name: string;
  gender?: string;
  relation?: string;
  birthDate?: string;
  status: string;
  generation: number;
  avatar?: string;
  spouse?: string;
  spouseId?: string;
  gothiram?: string;
  nativePlace?: string;
  email?: string;
  mobile?: string;
  children: HierarchicalPerson[];
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get("userId") || session.user.id;

    // Build a set of all connected family members
    const connectedPeople = new Set<string>();
    connectedPeople.add(targetUserId);

    // BFS to find all connected family members
    const queue: string[] = [targetUserId];
    const visited = new Set<string>();
    visited.add(targetUserId);

    while (queue.length > 0) {
      const currentPerson = queue.shift()!;

      const personRelationships = await Relationship.find({
        $or: [{ personId1: currentPerson }, { personId2: currentPerson }],
        isApproved: true,
      });

      personRelationships.forEach((rel: any) => {
        const otherId =
          rel.personId1.toString() === currentPerson
            ? rel.personId2.toString()
            : rel.personId1.toString();

        connectedPeople.add(otherId);

        if (!visited.has(otherId)) {
          visited.add(otherId);
          queue.push(otherId);
        }
      });
    }

    // Fetch all relationships
    const allRelationships = await Relationship.find({
      personId1: { $in: Array.from(connectedPeople) },
      personId2: { $in: Array.from(connectedPeople) },
      isApproved: true,
    })
      .populate(
        "personId1",
        "firstName lastName profilePicture gothiram nativePlace email mobile gender dob"
      )
      .populate(
        "personId2",
        "firstName lastName profilePicture gothiram nativePlace email mobile gender dob"
      );

    // Build person map
    const personMap = new Map<string, any>();
    allRelationships.forEach((rel: any) => {
      if (rel.personId1?._id) {
        personMap.set(rel.personId1._id.toString(), rel.personId1);
      }
      if (rel.personId2?._id) {
        personMap.set(rel.personId2._id.toString(), rel.personId2);
      }
    });

    // Add target user if not in map
    if (!personMap.has(targetUserId)) {
      const targetUser = await User.findById(targetUserId);
      if (targetUser) {
        personMap.set(targetUserId, targetUser);
      }
    }

    // Categorize relationship types
    const PARENT_TYPES = new Set([
      "Father",
      "Mother",
      "Grand Father",
      "Grand Mother",
    ]);
    const CHILD_TYPES = new Set(["Son", "Daughter", "Grandson", "Granddaughter"]);
    const SPOUSE_TYPE = "Spouse";
    const SIBLING_TYPES = new Set([
      "Brother",
      "Sister",
      "Sibling",
      "Older Sibling",
      "Younger Sibling",
    ]);
    const COUSIN_TYPES = new Set(["Cousin"]);

    // Build relationship graph
    const childrenMap = new Map<string, Array<{ id: string; relation: string }>>();
    const spouseMap = new Map<string, { id: string; name: string }>();
    const parentMap = new Map<string, Array<{ id: string; relation: string }>>();
    const siblingsMap = new Map<string, Array<{ id: string; relation: string }>>();

    allRelationships.forEach((rel: any) => {
      if (!rel.personId1 || !rel.personId2) return;

      const person1Id = rel.personId1._id.toString();
      const person2Id = rel.personId2._id.toString();
      const relType = rel.relationType;

      if (relType === SPOUSE_TYPE) {
        // Handle spouse relationships
        const person2Name = `${rel.personId2.firstName} ${rel.personId2.lastName}`.trim();
        spouseMap.set(person1Id, { id: person2Id, name: person2Name });
        
        const person1Name = `${rel.personId1.firstName} ${rel.personId1.lastName}`.trim();
        spouseMap.set(person2Id, { id: person1Id, name: person1Name });
      } else if (PARENT_TYPES.has(relType)) {
        // personId2 is parent of personId1
        if (!childrenMap.has(person2Id)) childrenMap.set(person2Id, []);
        childrenMap.get(person2Id)!.push({ id: person1Id, relation: "Child" });

        if (!parentMap.has(person1Id)) parentMap.set(person1Id, []);
        parentMap.get(person1Id)!.push({ id: person2Id, relation: relType });
      } else if (CHILD_TYPES.has(relType)) {
        // personId2 is child of personId1
        if (!childrenMap.has(person1Id)) childrenMap.set(person1Id, []);
        childrenMap.get(person1Id)!.push({ id: person2Id, relation: relType });

        if (!parentMap.has(person2Id)) parentMap.set(person2Id, []);
        const parentRelation = relType === "Son" ? "Father/Mother" : "Father/Mother";
        parentMap.get(person2Id)!.push({ id: person1Id, relation: parentRelation });
      } else if (SIBLING_TYPES.has(relType) || COUSIN_TYPES.has(relType)) {
        // Same level relationships - bidirectional
        if (!siblingsMap.has(person1Id)) siblingsMap.set(person1Id, []);
        siblingsMap.get(person1Id)!.push({ id: person2Id, relation: relType });

        if (!siblingsMap.has(person2Id)) siblingsMap.set(person2Id, []);
        siblingsMap.get(person2Id)!.push({ id: person1Id, relation: relType });
      }
    });

    // Calculate generations
    const generationMap = new Map<string, number>();
    const calculateGeneration = (personId: string, currentGen: number) => {
      if (generationMap.has(personId)) return;
      generationMap.set(personId, currentGen);

      // Set generation for children
      const children = childrenMap.get(personId) || [];
      children.forEach(({ id }) => {
        calculateGeneration(id, currentGen + 1);
      });

      // Set generation for parents
      const parents = parentMap.get(personId) || [];
      parents.forEach(({ id }) => {
        calculateGeneration(id, currentGen - 1);
      });

      // Set same generation for siblings and cousins
      const siblings = siblingsMap.get(personId) || [];
      siblings.forEach(({ id }) => {
        if (!generationMap.has(id)) {
          calculateGeneration(id, currentGen);
        }
      });

      // Set same generation for spouse
      const spouse = spouseMap.get(personId);
      if (spouse && !generationMap.has(spouse.id)) {
        calculateGeneration(spouse.id, currentGen);
      }
    };

    calculateGeneration(targetUserId, 0);

    // Build hierarchical structure with siblings
    const buildHierarchy = (
      personId: string,
      visitedInPath: Set<string> = new Set(),
      includeAllSiblings: boolean = false
    ): HierarchicalPerson | null => {
      if (visitedInPath.has(personId)) return null;
      visitedInPath.add(personId);

      const person = personMap.get(personId);
      if (!person) return null;

      const fullName = `${person.firstName} ${person.lastName}`.trim();
      const generation = generationMap.get(personId) || 0;
      const spouse = spouseMap.get(personId);

      const hierarchicalPerson: HierarchicalPerson = {
        id: personId,
        name: fullName,
        gender: person.gender?.toLowerCase(),
        relation: personId === targetUserId ? "You" : undefined,
        birthDate: person.dob ? new Date(person.dob).toISOString().split("T")[0] : undefined,
        status: "alive",
        generation,
        avatar: person.profilePicture,
        gothiram: person.gothiram,
        nativePlace: person.nativePlace,
        email: person.email,
        mobile: person.mobile,
        spouse: spouse?.name,
        spouseId: spouse?.id,
        children: [],
      };

      // Add children (actual children from parent-child relationships)
      const children = childrenMap.get(personId) || [];
      const childrenWithSiblings: HierarchicalPerson[] = [];

      children.forEach(({ id, relation }) => {
        const childNode = buildHierarchy(id, new Set(visitedInPath), true);
        if (childNode) {
          childNode.relation = relation;
          childrenWithSiblings.push(childNode);
        }
      });

      // If this is a parent node, group children with their siblings
      if (childrenWithSiblings.length > 0) {
        const processedChildren = new Set<string>();
        const groupedChildren: HierarchicalPerson[] = [];

        childrenWithSiblings.forEach((child) => {
          if (!processedChildren.has(child.id)) {
            groupedChildren.push(child);
            processedChildren.add(child.id);

            // Add siblings of this child at the same level
            const siblings = siblingsMap.get(child.id) || [];
            siblings.forEach(({ id: siblingId, relation: siblingRelation }) => {
              if (!processedChildren.has(siblingId) && !visitedInPath.has(siblingId)) {
                const siblingNode = buildHierarchy(siblingId, new Set(visitedInPath), false);
                if (siblingNode) {
                  siblingNode.relation = siblingRelation;
                  groupedChildren.push(siblingNode);
                  processedChildren.add(siblingId);
                }
              }
            });
          }
        });

        hierarchicalPerson.children = groupedChildren;
      }

      // For same-level relationships without parent-child context
      // (like when viewing someone's profile directly)
      if (includeAllSiblings && hierarchicalPerson.children.length === 0) {
        const siblings = siblingsMap.get(personId) || [];
        siblings.forEach(({ id: siblingId, relation }) => {
          if (!visitedInPath.has(siblingId)) {
            const siblingNode = buildHierarchy(siblingId, new Set(visitedInPath), false);
            if (siblingNode) {
              siblingNode.relation = relation;
              hierarchicalPerson.children.push(siblingNode);
            }
          }
        });
      }

      return hierarchicalPerson;
    };

    // Find root (person with lowest generation or target user)
    let rootId = targetUserId;
    let minGeneration = generationMap.get(targetUserId) || 0;

    generationMap.forEach((gen, id) => {
      if (gen < minGeneration) {
        minGeneration = gen;
        rootId = id;
      }
    });

    // Build hierarchy from root
    const hierarchy = buildHierarchy(rootId);

    if (!hierarchy) {
      // Fallback to single node
      const person = personMap.get(targetUserId);
      const fallbackHierarchy: HierarchicalPerson = {
        id: targetUserId,
        name: person
          ? `${person.firstName} ${person.lastName}`.trim()
          : "Unknown",
        status: "alive",
        generation: 0,
        children: [],
      };

      return NextResponse.json({
        hierarchy: [fallbackHierarchy],
        metadata: {
          totalMembers: 1,
          generations: 1,
          rootPerson: fallbackHierarchy.name,
        },
      });
    }

    // Calculate metadata
    const countMembers = (node: HierarchicalPerson): number => {
      return 1 + node.children.reduce((sum, child) => sum + countMembers(child), 0);
    };

    const totalMembers = countMembers(hierarchy);
    const generations = Math.max(...Array.from(generationMap.values())) - minGeneration + 1;

    return NextResponse.json({
      hierarchy: [hierarchy],
      metadata: {
        totalMembers,
        generations,
        rootPerson: hierarchy.name,
        targetUserId,
      },
    });
  } catch (error) {
    console.error("Hierarchy fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

