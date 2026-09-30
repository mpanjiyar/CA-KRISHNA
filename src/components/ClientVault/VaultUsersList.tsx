import React, { useState } from 'react';
import {
  Search,
  Filter,
  UserPlus,
  Building,
  Mail,
  Phone,
  Shield,
  Key,
  Sliders,
  MoreVertical,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpDown,
  Smartphone,
  ChevronRight
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { VaultUser, VaultAccountStatus, VaultAccountType } from '../../types/vault';

interface VaultUsersListProps {
  filterMode?: 'all' | 'clients' | 'staff';
  onOpenCreate: (type: VaultAccountType) => void;
  onSelectUser: (user: VaultUser) => void;
  onOpenPermissions: (user: VaultUser) => void;
  onSuccessToast: (msg: string) => void;
}

export const VaultUsersList: React.FC<VaultUsersListProps> = ({
  filterMode = 'all',
  onOpenCreate,
  onSelectUser,
  onOpenPermissions,
  onSuccessToast
}) => {
  const { users, toggleUserStatus, resetUserPassword } = useVault();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'name' | 'newest' | 'lastLogin' | 'status'>('name');

  // Filter based on parent tab (clients vs staff vs all)
  const baseUsers = users.filter((u) => {
    if (filterMode === 'clients') return u.accountType === 'client';
    if (filterMode === 'staff') return u.accountType === 'staff' || u.accountType === 'super_admin';
    return true;
  });

  const filteredUsers = baseUsers
    .filter((u) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        u.fullName.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        u.id.toLowerCase().includes(query) ||
        u.company.toLowerCase().includes(query) ||
        u.username.toLowerCase().includes(query) ||
        u.role.toLowerCase().includes(query);

      const matchesRole =
        selectedRoleFilter === 'All' ||
        (selectedRoleFilter === 'Clients' && u.accountType === 'client') ||
        (selectedRoleFilter === 'Staff' && (u.accountType === 'staff' || u.accountType === 'super_admin')) ||
        (selectedRoleFilter === 'Super Admin' && u.accountType === 'super_admin');

      const matchesStatus =
        selectedStatusFilter === 'All' || u.status === selectedStatusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.fullName.localeCompare(b.fullName);
      if (sortBy === 'newest') return b.createdAt.localeCompare(a.createdAt);
      if (sortBy === 'status') return a.status.localeCompare(b.status);
      return b.lastLogin.localeCompare(a.lastLogin);
    });

  const handleQuickReset = (user: VaultUser, e: React.MouseEvent) => {
    e.stopPropagation();
    const newPass = resetUserPassword(user.id);
    navigator.clipboard.writeText(newPass);
    onSuccessToast(`Generated new password for ${user.fullName} and copied to clipboard.`);
  };

  const handleQuickStatusToggle = (user: VaultUser, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus: VaultAccountStatus = user.status === 'Active' ? 'Suspended' : 'Active';
    toggleUserStatus(user.id, newStatus);
    onSuccessToast(`Account ${user.id} marked as ${newStatus}`);
  };

  return (
    <div className="space-y-4 text-left">
      {/* Top Action Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, company, role, or User ID (e.g. USR-CL-101)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0969C7] text-xs bg-white"
          />
        </div>

        {/* Filters & Sorting Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {filterMode === 'all' && (
            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold text-slate-700 text-xs focus:ring-1 focus:ring-[#0969C7]"
            >
              <option value="All">All Roles</option>
              <option value="Clients">Clients Only</option>
              <option value="Staff">Staff Only</option>
              <option value="Super Admin">Super Admins</option>
            </select>
          )}

          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold text-slate-700 text-xs focus:ring-1 focus:ring-[#0969C7]"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Inactive">Inactive</option>
            <option value="Suspended">Suspended</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold text-slate-700 text-xs focus:ring-1 focus:ring-[#0969C7]"
          >
            <option value="name">Sort by Name</option>
            <option value="newest">Sort by Newest</option>
            <option value="lastLogin">Sort by Last Login</option>
            <option value="status">Sort by Status</option>
          </select>

          <button
            type="button"
            onClick={() => onOpenCreate(filterMode === 'staff' ? 'staff' : 'client')}
            className="px-4 py-2 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition-colors shrink-0"
          >
            <UserPlus size={14} className="text-[#F28C18]" />
            <span>+ Create {filterMode === 'staff' ? 'Staff' : filterMode === 'clients' ? 'Client' : 'Account'}</span>
          </button>
        </div>
      </div>

      {/* Directory Table for Desktop / Card Stack for Mobile */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        {/* Mobile View: Card Stack */}
        <div className="md:hidden divide-y divide-slate-100">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => onSelectUser(user)}
              className="p-4 flex flex-col gap-2.5 active:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#062A5A] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                    {user.fullName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .substring(0, 2)
                      .toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-[#062A5A] truncate">{user.fullName}</div>
                    <div className="text-[11px] text-slate-500 truncate">{user.company}</div>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    user.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-700'
                      : user.status === 'Pending'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-red-50 text-red-600'
                  }`}
                >
                  {user.status}
                </span>
              </div>

              <div className="text-[11px] text-slate-500 flex items-center justify-between font-mono pt-1">
                <span>{user.id}</span>
                <span>Role: {user.role}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Full Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F7F9FC] border-b border-slate-200 text-slate-600 uppercase text-[11px] font-bold tracking-wider">
                <th className="py-3 px-4 font-manrope">User &amp; Organization</th>
                <th className="py-3 px-4">Account Type &amp; Role</th>
                <th className="py-3 px-4">Unique User ID</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned Projects</th>
                <th className="py-3 px-4">Last Authentication</th>
                <th className="py-3 px-4 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => onSelectUser(user)}
                  className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#062A5A] to-[#0969C7] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                        {user.fullName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .substring(0, 2)
                          .toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-[#062A5A] text-sm group-hover:text-[#0969C7] transition-colors truncate">
                          {user.fullName}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                          <Building size={11} className="text-slate-400 shrink-0" />
                          <span>{user.company}</span>
                        </div>
                        <div className="text-[10.5px] text-slate-400 font-mono truncate">{user.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-800 block">{user.role}</span>
                    <span
                      className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded font-mono inline-block mt-0.5 ${
                        user.accountType === 'super_admin'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : user.accountType === 'staff'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {user.accountType.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-[#0969C7] text-[11px]">
                    {user.id}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                        user.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : user.status === 'Pending'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : user.status === 'Inactive'
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-red-50 text-red-600 border border-red-200'
                      }`}
                    >
                      {user.status === 'Active' ? (
                        <CheckCircle2 size={11} />
                      ) : user.status === 'Pending' ? (
                        <Clock size={11} />
                      ) : (
                        <AlertTriangle size={11} />
                      )}
                      <span>{user.status}</span>
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    {user.assignedProjects.length > 0 ? (
                      <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[11px] font-semibold text-slate-700">
                        {user.assignedProjects.length} Projects
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px] italic">General Vault</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                    {user.lastLogin}
                  </td>

                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenPermissions(user);
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-[#0969C7] hover:bg-[#EEF5FC] transition-colors"
                        title="Configure Permissions"
                      >
                        <Sliders size={14} />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleQuickReset(user, e)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-[#F28C18] hover:bg-amber-50 transition-colors"
                        title="Quick Reset Password"
                      >
                        <Key size={14} />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleQuickStatusToggle(user, e)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          user.status === 'Active'
                            ? 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                            : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                        }`}
                        title={user.status === 'Active' ? 'Suspend Account' : 'Reactivate Account'}
                      >
                        {user.status === 'Active' ? <AlertTriangle size={14} /> : <CheckCircle2 size={14} />}
                      </button>

                      <button
                        type="button"
                        onClick={() => onSelectUser(user)}
                        className="p-1 text-slate-400 group-hover:text-slate-700"
                      >
                        <ChevronRight size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="p-12 text-center text-slate-400 text-xs">
            No accounts matching search criteria.
          </div>
        )}
      </div>
    </div>
  );
};
