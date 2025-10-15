// components/FamilyTreeNode.tsx
import { Handle, Position } from "@xyflow/react";

interface FamilyNodeData {
  label: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  gothiram?: string;
  nativePlace?: string;
  isCurrentUser?: boolean;
  onClick?: () => void;
}

interface FamilyTreeNodeProps {
  data: FamilyNodeData;
}

export default function FamilyTreeNode({ data }: FamilyTreeNodeProps) {
  const {
    label,
    firstName,
    lastName,
    profilePicture,
    gothiram,
    nativePlace,
    isCurrentUser,
    onClick,
  } = data;

  const initials = `${firstName[0]}${lastName[0]}`.toUpperCase();

  return (
    <div className="relative">
      {/* Handles for connections */}
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="w-3 h-3 bg-emerald-500 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="w-3 h-3 bg-emerald-500 border-2 border-white"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="w-3 h-3 bg-pink-500 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="w-3 h-3 bg-pink-500 border-2 border-white"
      />

      {/* Node content */}
      <div
        className={`
          min-w-[180px] max-w-[200px] p-4 rounded-xl shadow-lg border-2 transition-all duration-200
          hover:shadow-xl hover:scale-105 cursor-pointer
          ${
            isCurrentUser
              ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-white"
              : "bg-white text-gray-800 border-gray-200"
          }
        `}
        onClick={onClick}
      >
        {/* Profile picture or initials */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`
            w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold
            ${
              isCurrentUser
                ? "bg-white text-indigo-600"
                : "bg-indigo-100 text-indigo-600"
            }
          `}
          >
            {profilePicture ? (
              <img
                src={profilePicture}
                alt={label}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">{label}</h3>
            {gothiram && (
              <p
                className={`text-xs truncate ${
                  isCurrentUser ? "text-indigo-100" : "text-gray-500"
                }`}
              >
                {gothiram}
              </p>
            )}
          </div>
        </div>

        {/* Additional info */}
        {(nativePlace || isCurrentUser) && (
          <div
            className={`text-xs ${
              isCurrentUser ? "text-indigo-100" : "text-gray-600"
            }`}
          >
            {nativePlace && <p className="truncate">📍 {nativePlace}</p>}
            {isCurrentUser && <p className="font-medium mt-1">You</p>}
          </div>
        )}
      </div>
    </div>
  );
}
