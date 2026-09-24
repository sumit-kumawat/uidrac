/** tenant.service.ts — Tenant management. Super admin sees all tenants. */
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class TenantService {
  constructor(private prisma: PrismaService) {}

  async findOne(tenantId: string) {
    return this.prisma.tenant.findUnique({ where: { id: tenantId } });
  }

  async findAll() {
    return this.prisma.tenant.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async update(tenantId: string, data: { name?: string }) {
    return this.prisma.tenant.update({ where: { id: tenantId }, data });
  }

  async getUsers(tenantId: string | null) {
    const where = tenantId ? { tenantId } : {};
    return this.prisma.user.findMany({
      where,
      select: { id: true, email: true, role: true, tenantId: true, createdAt: true, lastLoginAt: true, tenant: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteUser(tenantId: string, userId: string, actorId: string) {
    if (userId === actorId) throw new ForbiddenException('Cannot delete your own account');
    const user = await this.prisma.user.findFirst({ where: { id: userId, tenantId } });
    if (!user) throw new NotFoundException('User not found');
    await this.prisma.user.delete({ where: { id: userId } });
    return { deleted: true };
  }

  async resetUserPassword(tenantId: string, userId: string) {
    const user = await this.prisma.user.findFirst({ where: { id: userId, tenantId } });
    if (!user) throw new NotFoundException('User not found');
    const temporaryPassword = crypto.randomBytes(9).toString('base64url');
    const passwordHash = await argon2.hash(temporaryPassword, { type: argon2.argon2id });
    await this.prisma.session.deleteMany({ where: { userId } });
    await this.prisma.user.update({ where: { id: userId }, data: { passwordHash } });
    return {
      message: 'Temporary password generated. Share it securely with the user.',
      temporaryPassword,
      email: user.email,
    };
  }

  async updateUserRole(tenantId: string, userId: string, role: string) {
    const user = await this.prisma.user.findFirst({ where: { id: userId, tenantId } });
    if (!user) throw new NotFoundException('User not found');
    return this.prisma.user.update({ where: { id: userId }, data: { role: role as any } });
  }
}
