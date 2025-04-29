import { injectable } from "tsyringe";
import ms from "ms";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { ITokenService } from "../../entities/serviceInterfaces/token-service.interface.js";
import { config } from "../../shared/config.js";

interface JWTPayloadData {
	userId: string;
	email: string;
	role: string;
}

export interface ResetTokenPayload extends JwtPayload {
	email: string;
}

@injectable()
export class JWTService implements ITokenService {
	private _accessSecret: Secret;
	private _accessExpiresIn: string;
	private _refreshSecret: Secret;
	private _refreshExpiresIn: string;
	private _resetSecret: Secret;
	private _resetExpiresIn: string;

	constructor() {
		this._accessSecret = config.jwt.ACCESS_SECRET_KEY;
		this._accessExpiresIn = config.jwt.ACCESS_EXPIRES_IN;
		this._refreshSecret = config.jwt.REFRESH_SECRET_KEY;
		this._refreshExpiresIn = config.jwt.REFRESH_EXPIRES_IN;
		this._resetSecret = config.jwt.RESET_SECRET_KEY;
		this._resetExpiresIn = config.jwt.RESET_EXPIRES_IN;
	}

	generateAccessToken(payload: {
		userId: string;
		email: string;
		role: string;
	}): string {
		return jwt.sign(payload, this._accessSecret, {
			expiresIn: this._accessExpiresIn as ms.StringValue,
		});
	}
	generateRefreshToken(payload: {
		userId: string;
		email: string;
		role: string;
	}): string {
		return jwt.sign(payload, this._refreshSecret, {
			expiresIn: this._refreshExpiresIn as ms.StringValue,
		});
	}
	verifyAccessToken(token: string): JwtPayload | null {
		try {
			return jwt.verify(token, this._accessSecret) as JwtPayload;
		} catch (error) {
			console.error("Access token verification failed:", error);
			return null;
		}
	}
	verifyRefreshToken(token: string): string | JwtPayload | null {
		try {
			return jwt.verify(token, this._refreshSecret) as JwtPayload;
		} catch (error) {
			console.error("Access token verification failed:", error);
			return null;
		}
	}
	decodeAccessToken(token: string): JwtPayload | null {
		try {
			return jwt.decode(token) as JwtPayload;
		} catch (error) {
			console.error("Access token decoding failed", error);
			return null;
		}
	}
	generateResetToken(email: string): string {
		return jwt.sign({ email }, this._resetSecret, {
			expiresIn: this._resetExpiresIn as ms.StringValue,
		});
	}

	verifyResetToken(token: string): ResetTokenPayload | null {
		try {
			return jwt.verify(token, this._resetSecret) as ResetTokenPayload;
		} catch (error) {
			console.error("Reset token verification failed:", error);
			return null;
		}
	}

	decodeResetToken(token: string): ResetTokenPayload | null {
		try {
			return jwt.decode(token) as ResetTokenPayload;
		} catch (error) {
			console.error("Reset token decoding failed", error);
			return null;
		}
	}
}
