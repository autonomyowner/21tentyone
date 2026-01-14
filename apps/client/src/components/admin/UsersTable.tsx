'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { AdminUser } from '@/lib/admin/types';

interface UsersTableProps {
  users: AdminUser[];
}

type SortField = 'firstName' | 'email' | 'product' | 'status' | 'createdAt' | 'lastActiveAt' | 'lifetimeValue';
type SortDirection = 'asc' | 'desc';

export function UsersTable({ users }: UsersTableProps) {
  const [search, setSearch] = useState('');
  const [productFilter, setProductFilter] = useState<'all' | 'protocol' | 'pdf' | 'free'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'churned'>('all');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Map tier to product for display
  const getProduct = (user: AdminUser) => {
    if (user.lifetimeValue >= 27) return 'protocol';
    if (user.lifetimeValue >= 9) return 'pdf';
    return 'free';
  };

  const getProductLabel = (product: string) => {
    switch (product) {
      case 'protocol': return '21-Day Protocol';
      case 'pdf': return 'Premium PDF';
      default: return 'Free PDF';
    }
  };

  const filteredUsers = useMemo(() => {
    let result = [...users];

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (u) =>
          u.email.toLowerCase().includes(searchLower) ||
          u.firstName?.toLowerCase().includes(searchLower) ||
          u.lastName?.toLowerCase().includes(searchLower)
      );
    }

    // Product filter
    if (productFilter !== 'all') {
      result = result.filter((u) => getProduct(u) === productFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((u) => u.status === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      let aVal: string | number = '';
      let bVal: string | number = '';

      switch (sortField) {
        case 'firstName':
          aVal = a.firstName || '';
          bVal = b.firstName || '';
          break;
        case 'email':
          aVal = a.email;
          bVal = b.email;
          break;
        case 'product':
          aVal = a.lifetimeValue;
          bVal = b.lifetimeValue;
          break;
        case 'status':
          aVal = a.status;
          bVal = b.status;
          break;
        case 'createdAt':
          aVal = new Date(a.createdAt).getTime();
          bVal = new Date(b.createdAt).getTime();
          break;
        case 'lastActiveAt':
          aVal = new Date(a.lastActiveAt).getTime();
          bVal = new Date(b.lastActiveAt).getTime();
          break;
        case 'lifetimeValue':
          aVal = a.lifetimeValue;
          bVal = b.lifetimeValue;
          break;
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return sortDirection === 'asc'
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });

    return result;
  }, [users, search, productFilter, statusFilter, sortField, sortDirection]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const SortIcon = ({ field }: { field: SortField }) => (
    <span className="ml-1 text-slate-400">
      {sortField === field ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
    </span>
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200">
      {/* Filters */}
      <div className="p-4 border-b border-slate-200 flex items-center gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="h-9 w-64 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <select
          value={productFilter}
          onChange={(e) => {
            setProductFilter(e.target.value as 'all' | 'protocol' | 'pdf' | 'free');
            setCurrentPage(1);
          }}
          className="h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Products</option>
          <option value="protocol">21-Day Protocol</option>
          <option value="pdf">Premium PDF</option>
          <option value="free">Free PDF</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as 'all' | 'active' | 'inactive' | 'churned');
            setCurrentPage(1);
          }}
          className="h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <div className="flex-1" />
        <span className="text-sm text-slate-500">
          {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th
                className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('firstName')}
              >
                User <SortIcon field="firstName" />
              </th>
              <th
                className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('product')}
              >
                Product <SortIcon field="product" />
              </th>
              <th
                className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('status')}
              >
                Status <SortIcon field="status" />
              </th>
              <th
                className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('createdAt')}
              >
                Joined <SortIcon field="createdAt" />
              </th>
              <th
                className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('lastActiveAt')}
              >
                Last Active <SortIcon field="lastActiveAt" />
              </th>
              <th
                className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('lifetimeValue')}
              >
                Spent <SortIcon field="lifetimeValue" />
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                Progress
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => {
              const product = getProduct(user);
              return (
                <tr
                  key={user.id}
                  className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <Link href={`/admin/users/${user.id}`} className="block">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-sm font-medium text-slate-600">
                          {user.firstName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        product === 'protocol'
                          ? 'bg-blue-50 text-blue-700'
                          : product === 'pdf'
                          ? 'bg-purple-50 text-purple-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {getProductLabel(product)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                        user.status === 'active'
                          ? 'text-green-600'
                          : 'text-slate-500'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          user.status === 'active'
                            ? 'bg-green-500'
                            : 'bg-slate-400'
                        }`}
                      />
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {formatDate(user.lastActiveAt)}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">
                    €{user.lifetimeValue}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${(user.dayCompleted / 21) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500">
                        {user.dayCompleted}/21
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-slate-200 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Showing {(currentPage - 1) * pageSize + 1} to{' '}
          {Math.min(currentPage * pageSize, filteredUsers.length)} of {filteredUsers.length} users
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="h-8 px-3 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum: number;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`h-8 w-8 text-sm font-medium rounded-lg ${
                  currentPage === pageNum
                    ? 'bg-blue-500 text-white'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="h-8 px-3 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
