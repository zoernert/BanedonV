'use client';

import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/page-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { apiClient } from '@/lib/api';
import { authService } from '@/lib/auth';
import { CreditCard, TrendingUp, Clock, Settings } from '@/components/icons';

interface BillingInfo {
  planName: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  amount: number;
  currency: string;
  usage: {
    storage: number;
    users: number;
    apiCalls: number;
  };
  limits: {
    storage: number;
    users: number;
    apiCalls: number;
  };
}

export default function BillingPage() {
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const user = authService.getUser();

  useEffect(() => {
    const fetchBillingInfo = async () => {
      try {
        const response = await apiClient.getBillingInfo();
        
        // Mock billing data for demonstration
        const mockBillingInfo: BillingInfo = {
          planName: 'Enterprise Premium',
          status: 'active',
          currentPeriodStart: '2024-01-01',
          currentPeriodEnd: '2024-01-31',
          amount: 250,
          currency: 'USD',
          usage: {
            storage: 2.3,
            users: 8,
            apiCalls: 15420
          },
          limits: {
            storage: 10,
            users: 25,
            apiCalls: 50000
          }
        };

        setBillingInfo(mockBillingInfo);
      } catch (error) {
        console.error('Error fetching billing info:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBillingInfo();
  }, []);

  if (isLoading) {
    return (
      <PageContainer title="Billing" description="Manage your subscription and billing">
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-3 w-[100px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-6 w-[80px] mb-2" />
                <Skeleton className="h-3 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </PageContainer>
    );
  }

  if (!authService.isManager()) {
    return (
      <PageContainer title="Billing" description="Manage your subscription and billing">
        <Card className="text-center py-12">
          <CardContent>
            <CreditCard className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle className="mb-2">Access Restricted</CardTitle>
            <CardDescription>
              Only managers and administrators can access billing information
            </CardDescription>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Billing"
      description="Manage your subscription and billing"
      actions={
        <Button>
          <Settings className="mr-2 h-4 w-4" />
          Manage Subscription
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Current Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              Current Plan
            </CardTitle>
            <CardDescription>
              Your subscription details and billing information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="text-2xl font-bold">{billingInfo?.planName}</div>
                <div className="text-sm text-muted-foreground mb-4">
                  Status: <span className="capitalize text-green-600">{billingInfo?.status}</span>
                </div>
                <div className="text-lg font-semibold">
                  ${billingInfo?.amount}/{billingInfo?.currency.toLowerCase()} per month
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                <div className="flex items-center mb-1">
                  <Clock className="mr-1 h-3 w-3" />
                  Current billing period
                </div>
                <div>
                  {billingInfo?.currentPeriodStart} - {billingInfo?.currentPeriodEnd}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{billingInfo?.usage.storage} GB</div>
              <div className="text-xs text-muted-foreground">
                of {billingInfo?.limits.storage} GB limit
              </div>
              <div className="mt-2 w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full" 
                  style={{ 
                    width: `${((billingInfo?.usage.storage || 0) / (billingInfo?.limits.storage || 1)) * 100}%` 
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{billingInfo?.usage.users}</div>
              <div className="text-xs text-muted-foreground">
                of {billingInfo?.limits.users} user limit
              </div>
              <div className="mt-2 w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full" 
                  style={{ 
                    width: `${((billingInfo?.usage.users || 0) / (billingInfo?.limits.users || 1)) * 100}%` 
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">API Calls</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{billingInfo?.usage.apiCalls.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">
                of {billingInfo?.limits.apiCalls.toLocaleString()} monthly limit
              </div>
              <div className="mt-2 w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full" 
                  style={{ 
                    width: `${((billingInfo?.usage.apiCalls || 0) / (billingInfo?.limits.apiCalls || 1)) * 100}%` 
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Billing Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Billing Actions</CardTitle>
            <CardDescription>
              Manage your subscription and billing preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline">
                <CreditCard className="mr-2 h-4 w-4" />
                Update Payment Method
              </Button>
              <Button variant="outline">
                Download Invoice
              </Button>
              <Button variant="outline">
                Billing History
              </Button>
              <Button variant="outline">
                Upgrade Plan
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Plan Features */}
        <Card>
          <CardHeader>
            <CardTitle>Plan Features</CardTitle>
            <CardDescription>
              What's included in your Enterprise Premium plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                  <span className="text-sm">10 GB Storage</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                  <span className="text-sm">25 Team Members</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                  <span className="text-sm">50,000 API Calls/month</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                  <span className="text-sm">Advanced Search</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                  <span className="text-sm">Priority Support</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                  <span className="text-sm">Custom Integrations</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                  <span className="text-sm">Advanced Analytics</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                  <span className="text-sm">SSO Integration</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
