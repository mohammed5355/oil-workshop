'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Service } from '@/lib/types';
import { getServices, setServices } from '@/lib/storage';

interface SalesContextType {
  services: Service[];
  addService: (service: Omit<Service, 'id' | 'createdAt'>) => void;
  getService: (id: string) => Service | undefined;
  getTodayServices: () => Service[];
  getServicesByDateRange: (startDate: string, endDate: string) => Service[];
  getTotalSales: (services?: Service[]) => number;
  getTodaySales: () => number;
  getMonthlySales: () => number;
  getCarsServedToday: () => number;
}

const SalesContext = createContext<SalesContextType | undefined>(undefined);

export const SalesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [services, setServicesState] = useState<Service[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setServicesState(getServices());
    setIsInitialized(true);

    const handleStorageChange = () => {
      setServicesState(getServices());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addService = (service: Omit<Service, 'id' | 'createdAt'>) => {
    const newService: Service = {
      ...service,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updatedServices = [...services, newService];
    setServices(updatedServices);
    setServicesState(updatedServices);
  };

  const getService = (id: string) => {
    return services.find(s => s.id === id);
  };

  const getTodayServices = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return services.filter(s => new Date(s.createdAt) >= today);
  };

  const getServicesByDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    return services.filter(s => {
      const date = new Date(s.createdAt);
      return date >= start && date <= end;
    });
  };

  const getTotalSales = (serviceList: Service[] = services) => {
    return serviceList.reduce((total, service) => total + service.totalPrice, 0);
  };

  const getTodaySales = () => {
    return getTotalSales(getTodayServices());
  };

  const getMonthlySales = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyServices = services.filter(s => new Date(s.createdAt) >= startOfMonth);
    return getTotalSales(monthlyServices);
  };

  const getCarsServedToday = () => {
    return getTodayServices().length;
  };

  if (!isInitialized) {
    return null;
  }

  return (
    <SalesContext.Provider
      value={{
        services,
        addService,
        getService,
        getTodayServices,
        getServicesByDateRange,
        getTotalSales,
        getTodaySales,
        getMonthlySales,
        getCarsServedToday,
      }}
    >
      {children}
    </SalesContext.Provider>
  );
};

export const useSales = () => {
  const context = useContext(SalesContext);
  if (context === undefined) {
    throw new Error('useSales must be used within a SalesProvider');
  }
  return context;
};
