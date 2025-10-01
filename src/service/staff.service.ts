import { StaffRepository } from '../repository/staff.repository';
import { Service, Inject } from 'typedi';
import bcrypt from 'bcryptjs';
import {
    CreateStaffRequestDto,
    GetStaffByIdRequestDto,
    GetAllStaffsRequestDto,
    UpdateStaffRequestDto,
    DeleteStaffRequestDto,
    CreateStaffResponseDto,
    GetStaffByIdResponseDto,
    GetAllStaffsResponseDto,
    UpdateStaffResponseDto,
    DeleteStaffResponseDto,
    StaffLoginRequestDto,
    StaffLoginResponseDto,
    StaffChangePasswordRequestDto,
    StaffChangePasswordResponseDto
} from '../dto/staff.dto';
import { ApiError } from '@/utils/err';
import { ApiStatusCode } from '@/utils/enum';
import { generateUserSessionToken, hashPassword, verifyPassword } from '@/utils/security';
import { prisma } from '@/repository/prisma/prisma';

export interface IStaffService {
    createStaff(req: CreateStaffRequestDto): Promise<CreateStaffResponseDto>;
    getStaffById(req: GetStaffByIdRequestDto): Promise<GetStaffByIdResponseDto>;
    getAllStaffs(req: GetAllStaffsRequestDto): Promise<GetAllStaffsResponseDto>;
    updateStaffById(req: UpdateStaffRequestDto): Promise<UpdateStaffResponseDto>;
    deleteStaffById(req: DeleteStaffRequestDto): Promise<DeleteStaffResponseDto>;
    staffLogin(req: StaffLoginRequestDto): Promise<StaffLoginResponseDto>;
    staffChangePassword(req: StaffChangePasswordRequestDto): Promise<StaffChangePasswordResponseDto>;
}

@Service()
export class StaffService implements IStaffService {
    @Inject(() => StaffRepository)
    private staffRepository!: StaffRepository;

    private bcryptKey: string = process.env.PASSWORD_HASHING_KEY || '';

    async createStaff(req: CreateStaffRequestDto): Promise<CreateStaffResponseDto> {
        // Step 1: Validate request
        const validatedReq = req.validate();

        // Step 2: Check if staff already exists
        const dbStaff = await prisma.$transaction(async (tx) => {
            const existingStaff = await this.staffRepository.getStaffByEmail(tx, validatedReq.email);
            if (existingStaff) {
                throw new ApiError('Staff already exists', ApiStatusCode.UNKNOWN_ERROR, 400);
            }

            const hashedPassword = await bcrypt.hash(validatedReq.password + this.bcryptKey, 10);

            const created = await this.staffRepository.createStaff(tx, {
                email: validatedReq.email,
                name: validatedReq.name || null,
                roleId: validatedReq.roleId,
                password: hashedPassword
            });

            return created;
        });

        // Step 4: Return response
        return new CreateStaffResponseDto({
            id: dbStaff.id,
            email: dbStaff.email,
            name: dbStaff.name || undefined,
            roleId: dbStaff.roleId,
            createdAt: dbStaff.createdAt,
            updatedAt: dbStaff.updatedAt
        });
    }

    async getStaffById(req: GetStaffByIdRequestDto): Promise<GetStaffByIdResponseDto> {
        // Step 1: Validate request
        const validatedReq = req.validate();

        // Step 2: Get staff
        const dbStaff = await this.staffRepository.getStaffById(undefined, validatedReq.id);
        if (!dbStaff) {
            throw new ApiError('Staff not found', ApiStatusCode.UNKNOWN_ERROR, 404);
        }

        // Step 3: Return response
        return new GetStaffByIdResponseDto({
            id: dbStaff.id,
            email: dbStaff.email,
            name: dbStaff.name || undefined,
            roleId: dbStaff.roleId,
            createdAt: dbStaff.createdAt,
            updatedAt: dbStaff.updatedAt
        });
    }

    async getAllStaffs(req: GetAllStaffsRequestDto): Promise<GetAllStaffsResponseDto> {
        // Step 1: Validate request
        const validatedReq = req.validate();

        // Step 2: Get staffs
        const { staffs, total } = await this.staffRepository.getAllStaffs(undefined,
            validatedReq.limit,
            validatedReq.offset,
            validatedReq.orderBy
        );

        // Step 3: Return response
        return new GetAllStaffsResponseDto({
            staffs: staffs.map(staff => ({
                id: staff.id,
                email: staff.email,
                name: staff.name || undefined,
                roleId: staff.roleId,
                createdAt: staff.createdAt,
                updatedAt: staff.updatedAt
            })),
            total: total
        });
    }

    async updateStaffById(req: UpdateStaffRequestDto): Promise<UpdateStaffResponseDto> {
        // Step 1: Validate request
        const validatedReq = req.validate();

        // Step 2: Prepare update data
        const updateData: any = {
            email: validatedReq.email,
            name: validatedReq.name || null
        };

        // Step 3: Update staff
        const dbStaff = await prisma.$transaction(async (tx) => {
            const updated = await this.staffRepository.updateStaffById(tx, validatedReq.id, updateData);
            return updated;
        });

        // Step 4: Return response
        return new UpdateStaffResponseDto({
            id: dbStaff.id,
            email: dbStaff.email,
            name: dbStaff.name || undefined,
            roleId: dbStaff.roleId,
            createdAt: dbStaff.createdAt,
            updatedAt: dbStaff.updatedAt
        });
    }

    async deleteStaffById(req: DeleteStaffRequestDto): Promise<DeleteStaffResponseDto> {
        // Step 1: Validate request
        const validatedReq = req.validate();

        // Step 2: Delete staff
        await prisma.$transaction(async (tx) => {
            await this.staffRepository.deleteStaffById(tx, validatedReq.id);
        });

        // Step 3: Return response
        return new DeleteStaffResponseDto({
            success: true,
            message: 'Staff deleted successfully'
        });
    }

    async staffLogin(req: StaffLoginRequestDto): Promise<StaffLoginResponseDto> {
        const staff = await this.staffRepository.getStaffByEmail(undefined, req.email);
        if (!staff) {
            throw new ApiError('Invalid email or password', ApiStatusCode.UNKNOWN_ERROR, 404);
        }

        const isPasswordValid = await bcrypt.compare(req.password + this.bcryptKey, staff.password);
        if (!isPasswordValid) {
            throw new ApiError('Invalid email or password', ApiStatusCode.UNKNOWN_ERROR, 404);
        }

        const token = generateUserSessionToken(staff.id, staff.roleId);

        return new StaffLoginResponseDto({
            token: token
        });
    }

    async staffChangePassword(req: StaffChangePasswordRequestDto): Promise<StaffChangePasswordResponseDto> {
        const validatedReq = req.validate();

        const staff = await this.staffRepository.getStaffById(undefined, validatedReq.id);
        if (!staff) {
            throw new ApiError('Staff not found', ApiStatusCode.UNKNOWN_ERROR, 404);
        }

        const isOldPasswordValid = await bcrypt.compare(validatedReq.oldPassword + this.bcryptKey, staff.password);
        if (!isOldPasswordValid) {
            throw new ApiError('Old password is incorrect', ApiStatusCode.UNKNOWN_ERROR, 400);
        }

        const newHashedPassword = await bcrypt.hash(validatedReq.newPassword + this.bcryptKey, 10);
        const updated = await prisma.$transaction(async (tx) => {
            const u = await this.staffRepository.updateStaffById(tx, validatedReq.id, { password: newHashedPassword });
            return u;
        });

        return new StaffChangePasswordResponseDto({
            id: updated.id,
            email: updated.email,
            name: updated.name || undefined,
            createdAt: updated.createdAt,
            updatedAt: updated.updatedAt,
        });
    }
} 