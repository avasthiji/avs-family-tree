import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";

const { Top, Bottom, Left, Right } = Position;

interface FamilyTreeNodeProps {
  data: {
    label: string;
    firstName: string;
    lastName: string;
    initials: string;
    gothiram?: string;
    nativePlace?: string;
    isCurrentUser: boolean;
    isSpouse?: boolean;
    isSibling?: boolean;
    isRoot?: boolean;
    direction: string;
    children?: string[];
    siblings?: string[];
    spouses?: string[];
    onClick?: () => void;
  };
}

export default memo(({ data }: FamilyTreeNodeProps) => {
  const {
    isSpouse,
    isSibling,
    firstName,
    lastName,
    initials,
    gothiram,
    nativePlace,
    isCurrentUser,
    direction,
  } = data;
  const isTreeHorizontal = direction === "LR";

  const getTargetPosition = () => {
    if (isSpouse) {
      return isTreeHorizontal ? Top : Left;
    } else if (isSibling) {
      return isTreeHorizontal ? Bottom : Right;
    }
    return isTreeHorizontal ? Left : Top;
  };

  const isRootNode = data?.isRoot;
  const hasChildren = !!data?.children?.length;
  const hasSiblings = !!data?.siblings?.length;
  const hasSpouses = !!data?.spouses?.length;

  const fullName = `${firstName} ${lastName}`.trim();

  return (
    <div className="nodrag">
      {/* Handles for connections */}
      {hasChildren && (
        <Handle
          type="source"
          position={isTreeHorizontal ? Right : Bottom}
          id={isTreeHorizontal ? Right : Bottom}
          style={{ opacity: 0 }}
        />
      )}
      {hasSpouses && (
        <Handle
          type="source"
          position={isTreeHorizontal ? Bottom : Right}
          id={isTreeHorizontal ? Bottom : Right}
          style={{ opacity: 0 }}
        />
      )}
      {hasSiblings && (
        <Handle
          type="source"
          position={isTreeHorizontal ? Top : Left}
          id={isTreeHorizontal ? Top : Left}
          style={{ opacity: 0 }}
        />
      )}
      {!isRootNode && (
        <Handle
          type="target"
          position={getTargetPosition()}
          id={getTargetPosition()}
          style={{ opacity: 0 }}
        />
      )}

      {/* Card Design */}
      <div
        className="card-inner cursor-pointer"
        onClick={data.onClick}
        style={{
          width: "200px",
          height: "160px",
          padding: "15px",
          borderRadius: "10px",
          background: "white",
          border: isCurrentUser ? "3px solid #3b82f6" : "2px solid #e5e7eb",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          position: "relative",
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: isCurrentUser ? "#3b82f6" : "#8b5cf6",
            border: "4px solid white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "10px",
          }}
        >
          <span
            style={{ color: "white", fontSize: "16px", fontWeight: "bold" }}
          >
            {initials}
          </span>
        </div>

        {/* Name */}
        <div
          style={{
            color: "#1f2937",
            fontSize: "14px",
            fontWeight: "bold",
            marginBottom: "4px",
          }}
        >
          {fullName}
        </div>

        {/* Gothiram */}
        {gothiram && (
          <div
            style={{ color: "#6b7280", fontSize: "12px", marginBottom: "2px" }}
          >
            {gothiram}
          </div>
        )}

        {/* Native Place */}
        {nativePlace && (
          <div style={{ color: "#9ca3af", fontSize: "10px" }}>
            {nativePlace}
          </div>
        )}

        {/* "You" Badge */}
        {isCurrentUser && (
          <div
            style={{
              position: "absolute",
              bottom: "10px",
              background: "#dbeafe",
              color: "#2563eb",
              padding: "2px 8px",
              borderRadius: "8px",
              fontSize: "10px",
              fontWeight: "500",
            }}
          >
            You
          </div>
        )}
      </div>
    </div>
  );
});
