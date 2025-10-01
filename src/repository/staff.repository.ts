import { Prisma, Staff as PrismaStaff } from '@prisma/client';
import { prisma } from './prisma/prisma';
import { Service } from 'typedi';

export interface IStaffRepository {
    createStaff(tx: Prisma.TransactionClient | undefined, staff: Omit<PrismaStaff, 'id' | 'createdAt' | 'updatedAt'>): Promise<PrismaStaff>;
    getStaffById(tx: Prisma.TransactionClient | undefined, id: number): Promise<PrismaStaff | null>;
    getStaffByEmail(tx: Prisma.TransactionClient | undefined, email: string): Promise<PrismaStaff | null>;
    getAllStaffs(tx: Prisma.TransactionClient | undefined, limit?: number, offset?: number, orderBy?: { field: keyof PrismaStaff, direction: 'asc' | 'desc' }): Promise<{ staffs: PrismaStaff[], total: number }>;
    updateStaffById(tx: Prisma.TransactionClient | undefined, id: number, staff: Partial<Omit<PrismaStaff, 'id' | 'createdAt' | 'updatedAt'>>): Promise<PrismaStaff>;
    deleteStaffById(tx: Prisma.TransactionClient | undefined, id: number): Promise<void>;
}

@Service()
export class StaffRepository implements IStaffRepository {

    async createStaff(tx: Prisma.TransactionClient | undefined, staff: Omit<PrismaStaff, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted'>): Promise<PrismaStaff> {
        const client = (tx ?? prisma);
        const createdStaff = await client.staff.create({
            data: {
                email: staff.email,
                name: staff.name,
                roleId: staff.roleId,
                password: staff.password,
            },
        });
        return createdStaff;
    }

    async getStaffById(tx: Prisma.TransactionClient | undefined, id: number): Promise<PrismaStaff | null> {
        const client = (tx ?? prisma);
        return client.staff.findUnique({
            where: {
                id,
                isDeleted: false
            },
        });
    }

    async getStaffByEmail(tx: Prisma.TransactionClient | undefined, email: string): Promise<PrismaStaff | null> {
        const client = (tx ?? prisma);
        return client.staff.findUnique({
            where: {
                email,
                isDeleted: false
            },
        });
    }

    async getAllStaffs(
        tx: Prisma.TransactionClient | undefined,
        limit?: number,
        offset?: number,
        orderBy?: { field: keyof PrismaStaff, direction: 'asc' | 'desc' }
    ): Promise<{ staffs: PrismaStaff[], total: number }> {
        const client = (tx ?? prisma);
        const staffs = await client.staff.findMany({
            where: { isDeleted: false },
            take: limit,
            skip: offset,
            orderBy: orderBy ? { [orderBy.field]: orderBy.direction } : { createdAt: 'desc' },
        });

        const total = await client.staff.count();
        return { staffs, total };
    }

    async updateStaffById(tx: Prisma.TransactionClient | undefined, id: number, staff: Partial<Omit<PrismaStaff, 'id' | 'createdAt' | 'updatedAt'>>): Promise<PrismaStaff> {
        const client = (tx ?? prisma);
        return client.staff.update({
            where: {
                id,
                isDeleted: false
            },
            data: {
                email: staff.email,
                name: staff.name,
                roleId: staff.roleId,
                password: staff.password,
            },
        });
    }

    async deleteStaffById(tx: Prisma.TransactionClient | undefined, id: number): Promise<void> {
        const client = (tx ?? prisma);
        await client.staff.delete({
            where: { id },
        });
    }
} 