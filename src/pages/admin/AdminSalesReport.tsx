import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { FileText, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';

type QuoteRow = {
  id: string;
  created_at: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string | null;
  product_interest: string | null;
  quantity: number | null;
  status: string;
  message: string;
};

const statusColor: Record<string, string> = {
  pending: 'bg-yellow-500/15 text-yellow-700 border-yellow-300',
  approved: 'bg-green-500/15 text-green-700 border-green-300',
  rejected: 'bg-red-500/15 text-red-700 border-red-300',
  completed: 'bg-blue-500/15 text-blue-700 border-blue-300',
};

const AdminSalesReport = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [perPage, setPerPage] = useState(25);

  const { data: quotes = [], isLoading } = useQuery({
    queryKey: ['admin-sales-report'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quote_requests')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as QuoteRow[];
    },
  });

  const filtered = useMemo(() => {
    let rows = quotes;
    if (statusFilter !== 'all') {
      rows = rows.filter((r) => r.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.company_name.toLowerCase().includes(q) ||
          r.contact_person.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          (r.product_interest ?? '').toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q)
      );
    }
    return rows;
  }, [quotes, statusFilter, search]);

  const displayed = filtered.slice(0, perPage);

  // Summary stats
  const totalQuotes = quotes.length;
  const pendingCount = quotes.filter((r) => r.status === 'pending').length;
  const approvedCount = quotes.filter((r) => r.status === 'approved' || r.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" /> Sales Report
        </h1>
        <p className="text-muted-foreground mt-1">Overview of all quote requests and their statuses.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-sm text-muted-foreground">Total Quotes</p>
            <p className="text-3xl font-bold text-foreground">{totalQuotes}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-sm text-muted-foreground">Approved / Completed</p>
            <p className="text-3xl font-bold text-green-600">{approvedCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4" /> Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by company, contact, email, product…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={String(perPage)} onValueChange={(v) => setPerPage(Number(v))}>
            <SelectTrigger className="w-full sm:w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="25">Show 25</SelectItem>
              <SelectItem value="50">Show 50</SelectItem>
              <SelectItem value="100">Show 100</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[170px]">Date</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Product Interest</TableHead>
                <TableHead className="text-center">Qty</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    Loading…
                  </TableCell>
                </TableRow>
              ) : displayed.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    No quote requests found.
                  </TableCell>
                </TableRow>
              ) : (
                displayed.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {format(new Date(row.created_at), 'dd/MM/yyyy HH:mm')}
                    </TableCell>
                    <TableCell className="font-medium">{row.company_name}</TableCell>
                    <TableCell>
                      <div>{row.contact_person}</div>
                      <div className="text-xs text-muted-foreground">{row.email}</div>
                    </TableCell>
                    <TableCell className="max-w-[220px] truncate text-sm">
                      {row.product_interest || '—'}
                    </TableCell>
                    <TableCell className="text-center">{row.quantity ?? '—'}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={`capitalize ${statusColor[row.status] ?? ''}`}
                      >
                        {row.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground text-right">
        Showing {displayed.length} of {filtered.length} records
      </p>
    </div>
  );
};

export default AdminSalesReport;
