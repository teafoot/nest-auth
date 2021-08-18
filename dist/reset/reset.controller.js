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
exports.ResetController = void 0;
const mailer_1 = require("@nestjs-modules/mailer");
const common_1 = require("@nestjs/common");
const reset_service_1 = require("./reset.service");
let ResetController = class ResetController {
    constructor(resetService, mailService) {
        this.resetService = resetService;
        this.mailService = mailService;
    }
    async forgot(email) {
        const token = Math.random().toString(20).substr(2, 12);
        await this.resetService.create({
            email,
            token
        });
        const url = `http://localhost:4200/reset/${token}`;
        await this.mailService.sendMail({
            to: email,
            subject: 'Reset your password',
            html: `Click <a href="${url}">here</a> to reset your password.`
        });
        return {
            message: 'Check your email.'
        };
    }
};
__decorate([
    common_1.Post('forgot'),
    __param(0, common_1.Body('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ResetController.prototype, "forgot", null);
ResetController = __decorate([
    common_1.Controller(),
    __metadata("design:paramtypes", [reset_service_1.ResetService,
        mailer_1.MailerService])
], ResetController);
exports.ResetController = ResetController;
//# sourceMappingURL=reset.controller.js.map