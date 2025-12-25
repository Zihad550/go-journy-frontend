import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CardLoader } from "@/components/ui/card-loader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageSpinner } from "@/components/ui/spinner";
import { Role, UserAccountStatus } from "@/constants";
import {
  useBlockUserMutation,
  useDeleteUserMutation,
  useGetAllUsersQuery,
  useUpdateAdminUserMutation,
} from "@/redux/features/admin/admin-api";
import { useUserInfoQuery } from "@/redux/features/user/user-api";
import type { IUser } from "@/types";
import {
  Ban,
  Eye,
  MoreHorizontal,
  RefreshCw,
  Search,
  Trash2,
  UserCheck,
  Users,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { toast } from "sonner";

interface UserFilters {
  search: string;
  role: string;
  status: string;
}

interface UserTableProps {
  users: IUser[];
  onEdit: (user: IUser) => void;
  onBlock: (user: IUser) => void;
  onDelete: (user: IUser) => void;
  onView: (user: IUser) => void;
  isLoading: boolean;
}

const getStatusBadge = (status: string) => {
  const variants = {
    [UserAccountStatus.ACTIVE]: "bg-green-100 text-green-800",
    [UserAccountStatus.INACTIVE]: "bg-yellow-100 text-yellow-800",
    [UserAccountStatus.BLOCKED]: "bg-red-100 text-red-800",
  };

  return (
    <Badge
      className={
        variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"
      }
    >
      {status}
    </Badge>
  );
};

const getRoleBadge = (role: string) => {
  const variants = {
    [Role.SUPER_ADMIN]: "bg-purple-100 text-purple-800",
    [Role.ADMIN]: "bg-blue-100 text-blue-800",
    [Role.RIDER]: "bg-green-100 text-green-800",
    [Role.DRIVER]: "bg-orange-100 text-orange-800",
  };

  return (
    <Badge
      className={
        variants[role as keyof typeof variants] || "bg-gray-100 text-gray-800"
      }
    >
      {role}
    </Badge>
  );
};

const UserTable: React.FC<UserTableProps & { currentUserRole?: string }> = ({
  users,
  onEdit,
  onBlock,
  onDelete,
  onView,
  isLoading,
  currentUserRole,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-4 font-medium">User</th>
            <th className="text-left p-4 font-medium">Role</th>
            <th className="text-left p-4 font-medium">Status</th>
            <th className="text-left p-4 font-medium">Phone</th>
            <th className="text-left p-4 font-medium">Joined</th>
            <th className="text-left p-4 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-b hover:bg-muted/50">
              <td className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {user.email}
                    </div>
                  </div>
                </div>
              </td>
              <td className="p-4">{getRoleBadge(user.role)}</td>
              <td className="p-4">{getStatusBadge(user.isActive)}</td>
              <td className="p-4">
                <span className="text-sm font-mono">{user.phone}</span>
              </td>
              <td className="p-4">
                <span className="text-sm">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </td>
              <td className="p-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onView(user)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    {(currentUserRole === Role.SUPER_ADMIN ||
                      currentUserRole === Role.ADMIN) && (
                      <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => onEdit(user)}>
                          <UserCheck className="mr-2 h-4 w-4" />
                          Edit User
                        </DropdownMenuItem>

                        {user.isActive === UserAccountStatus.ACTIVE ? (
                          <DropdownMenuItem
                            onClick={() => onBlock(user)}
                            disabled={isLoading}
                          >
                            <Ban className="mr-2 h-4 w-4" />
                            Block User
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => onBlock(user)}
                            disabled={isLoading}
                          >
                            <UserCheck className="mr-2 h-4 w-4" />
                            Unblock User
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => onDelete(user)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default function UserManagement() {
  const [filters, setFilters] = useState<UserFilters>({
    search: "",
    role: "all",
    status: "all",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [viewingUser, setViewingUser] = useState<IUser | null>(null);
  const [blockingUserId, setBlockingUserId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    role: "",
    isActive: "",
  });

  const {
    data: usersResponse,
    isLoading,
    error,
    refetch,
  } = useGetAllUsersQuery({
    page: currentPage,
    limit: pageSize,
    search: filters.search || undefined,
  });

  const { data: currentUserData, error: currentUserError } =
    useUserInfoQuery(undefined);

  const [blockUser] = useBlockUserMutation();
  const [updateAdminUser] = useUpdateAdminUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const users = usersResponse?.data || [];
  const totalUsers = usersResponse?.meta?.total || 0;
  const totalPages = usersResponse?.meta?.totalPage || 1;

  const currentUserRole = currentUserError
    ? undefined
    : currentUserData?.data?.role;

  const filteredUsers = useMemo(() => {
    if (!users) return [];

    return users.filter((user) => {
      const matchesSearch =
        !filters.search ||
        user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase());

      const matchesRole = filters.role === "all" || user.role === filters.role;
      const matchesStatus =
        filters.status === "all" || user.isActive === filters.status;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, filters]);

  const handleBlockUser = async (user: IUser) => {
    try {
      setBlockingUserId(user._id);
      // Determine the action based on current user status
      const status =
        user.isActive === UserAccountStatus.ACTIVE ? "blocked" : "active";
      await blockUser({ id: user._id, status }).unwrap();
      // Success notification would be handled by the mutation
    } catch {
      toast.error("Failed to block/unblock user");
    } finally {
      setBlockingUserId(null);
    }
  };

  const handleDeleteUser = async (user: IUser) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
      )
    ) {
      try {
        await deleteUser({ id: user._id }).unwrap();
        // Success notification would be handled by the mutation
      } catch {
        toast.error("Failed to delete user");
      }
    }
  };

  const handleEditUser = (user: IUser) => {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      role: user.role,
      isActive: user.isActive,
    });
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;

    try {
      const updatePayload: {
        id: string;
        name: string;
        isActive: string;
        role?: string;
      } = {
        id: editingUser._id,
        name: editForm.name,
        isActive: editForm.isActive,
      };

      if (editingUser.role === Role.RIDER) {
        updatePayload.role = editForm.role;
      }

      await updateAdminUser(updatePayload).unwrap();
      setEditingUser(null);
      // Success notification would be handled by the mutation
    } catch {
      toast.error("Failed to update user");
    }
  };

  const handleViewUser = (user: IUser) => {
    setViewingUser(user);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts, roles, and permissions
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users ({totalUsers})</CardTitle>
          <CardDescription>
            View and manage all user accounts in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search users by name or email..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                  }
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filters.role}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, role: e.target.value }))
                }
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">All Roles</option>
                <option value={Role.SUPER_ADMIN}>Super Admin</option>
                <option value={Role.ADMIN}>Admin</option>
                <option value={Role.RIDER}>Rider</option>
                <option value={Role.DRIVER}>Driver</option>
              </select>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, status: e.target.value }))
                }
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value={UserAccountStatus.ACTIVE}>Active</option>
                <option value={UserAccountStatus.INACTIVE}>Inactive</option>
                <option value={UserAccountStatus.BLOCKED}>Blocked</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          {isLoading ? (
            <CardLoader message="Loading users..." />
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">Failed to load users</div>
              <Button onClick={() => refetch()} variant="outline">
                Try Again
              </Button>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No users found</h3>
              <p className="text-muted-foreground">
                {filters.search ||
                filters.role !== "all" ||
                filters.status !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "No users have been registered yet"}
              </p>
            </div>
          ) : (
            <>
              <UserTable
                users={filteredUsers}
                onEdit={handleEditUser}
                onBlock={handleBlockUser}
                onDelete={handleDeleteUser}
                onView={handleViewUser}
                isLoading={!!blockingUserId}
                currentUserRole={currentUserRole}
              />

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * pageSize + 1} to{" "}
                    {Math.min(currentPage * pageSize, totalUsers)} of{" "}
                    {totalUsers} users
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information. Role changes are only allowed for riders.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input
                value={editForm.name}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter user name"
              />
            </div>
            {editingUser?.role === Role.RIDER && (
              <div>
                <label className="text-sm font-medium">Role</label>
                <Select
                  value={editForm.role}
                  onValueChange={(value) =>
                    setEditForm((prev) => ({ ...prev, role: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Role.RIDER}>Rider</SelectItem>
                    <SelectItem value={Role.ADMIN}>Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select
                value={editForm.isActive}
                onValueChange={(value) =>
                  setEditForm((prev) => ({ ...prev, isActive: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserAccountStatus.ACTIVE}>
                    Active
                  </SelectItem>
                  <SelectItem value={UserAccountStatus.INACTIVE}>
                    Inactive
                  </SelectItem>
                  <SelectItem value={UserAccountStatus.BLOCKED}>
                    Blocked
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingUser(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View User Details Dialog */}
      <Dialog open={!!viewingUser} onOpenChange={() => setViewingUser(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              View detailed information about this user account.
            </DialogDescription>
          </DialogHeader>
          {viewingUser && (
            <div className="space-y-6">
              {/* User Avatar and Basic Info */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{viewingUser.name}</h3>
                  <p className="text-muted-foreground">{viewingUser.email}</p>
                </div>
              </div>

              {/* User Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Full Name
                    </label>
                    <p className="text-sm font-medium">{viewingUser.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Email Address
                    </label>
                    <p className="text-sm font-medium">{viewingUser.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Phone Number
                    </label>
                    <p className="text-sm font-medium font-mono">
                      {viewingUser.phone}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Role
                    </label>
                    <div className="mt-1">{getRoleBadge(viewingUser.role)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Account Status
                    </label>
                    <div className="mt-1">
                      {getStatusBadge(viewingUser.isActive)}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Joined Date
                    </label>
                    <p className="text-sm font-medium">
                      {viewingUser.createdAt
                        ? new Date(viewingUser.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Information Section */}
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  Account Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">User ID:</span>
                    <span className="ml-2 font-mono text-xs">
                      {viewingUser._id}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Last Updated:</span>
                    <span className="ml-2">
                      {viewingUser.updatedAt
                        ? new Date(viewingUser.updatedAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingUser(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Full Screen Loading Spinner */}
      {blockingUserId && (
        <PageSpinner
          message="Updating user status..."
          fullScreen={true}
          size="xl"
          variant="default"
        />
      )}
    </div>
  );
}
