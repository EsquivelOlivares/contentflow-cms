"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const rxjs_1 = require("rxjs");
let AppController = class AppController {
    contentClient;
    userClient;
    constructor(contentClient, userClient) {
        this.contentClient = contentClient;
        this.userClient = userClient;
    }
    async register(registerDto) {
        try {
            const result = await (0, rxjs_1.firstValueFrom)(this.userClient.send({ cmd: 'auth_register' }, registerDto));
            return { success: true, data: result };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    async login(loginDto) {
        try {
            const result = await (0, rxjs_1.firstValueFrom)(this.userClient.send({ cmd: 'auth_login' }, loginDto));
            return { success: true, data: result };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    async createContent(createContentDto) {
        try {
            const result = await (0, rxjs_1.firstValueFrom)(this.contentClient.send({ cmd: 'create_content' }, createContentDto));
            return { success: true, data: result };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    async findAllContent() {
        try {
            const result = await (0, rxjs_1.firstValueFrom)(this.contentClient.send({ cmd: 'find_all_content' }, {}));
            return { success: true, data: result };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    async findOneContent(id) {
        try {
            const result = await (0, rxjs_1.firstValueFrom)(this.contentClient.send({ cmd: 'find_one_content' }, id));
            return { success: true, data: result };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    async updateContent(id, updateContentDto) {
        try {
            const result = await (0, rxjs_1.firstValueFrom)(this.contentClient.send({ cmd: 'update_content' }, { id, dto: updateContentDto }));
            return { success: true, data: result };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    async removeContent(id) {
        try {
            const result = await (0, rxjs_1.firstValueFrom)(this.contentClient.send({ cmd: 'remove_content' }, id));
            return { success: true, data: result };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    async getRecentActivity() {
        try {
            const result = await (0, rxjs_1.firstValueFrom)(this.contentClient.send({ cmd: 'get_recent_activity' }, 10));
            return { success: true, data: result };
        }
        catch (error) {
            console.error('Error fetching activity:', error);
            return { success: false, error: error.message };
        }
    }
    async testContent() {
        try {
            const result = await (0, rxjs_1.firstValueFrom)(this.contentClient.send({ cmd: 'test' }, { message: 'Hola desde gateway' }));
            return { success: true, data: result };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    async testAuth() {
        try {
            const result = await (0, rxjs_1.firstValueFrom)(this.userClient.send({ cmd: 'test' }, { message: 'Hola desde gateway' }));
            return { success: true, data: result };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Post)('auth/register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('auth/login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('content'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "createContent", null);
__decorate([
    (0, common_1.Get)('content'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "findAllContent", null);
__decorate([
    (0, common_1.Get)('content/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "findOneContent", null);
__decorate([
    (0, common_1.Patch)('content/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "updateContent", null);
__decorate([
    (0, common_1.Delete)('content/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "removeContent", null);
__decorate([
    (0, common_1.Get)('activity/recent'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getRecentActivity", null);
__decorate([
    (0, common_1.Get)('content/test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "testContent", null);
__decorate([
    (0, common_1.Get)('auth/test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "testAuth", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __param(0, (0, common_1.Inject)('CONTENT_SERVICE')),
    __param(1, (0, common_1.Inject)('USER_SERVICE')),
    __metadata("design:paramtypes", [microservices_1.ClientProxy,
        microservices_1.ClientProxy])
], AppController);
//# sourceMappingURL=app.controller.js.map