export interface AuthenticatedUser {
	id: string;
	[key: string]: unknown;
}

export interface ApiResponse<T> {
	success: boolean;
	data: T;
}

export interface BaseRequest<TBody = any, TParams = any, TQuery = any> {
	body: TBody;
	params: TParams;
	query: TQuery;
}

export interface AuthenticatedRequest<TBody = any, TParams = any, TQuery = any>
	extends BaseRequest<TBody, TParams, TQuery> {
	user: AuthenticatedUser;
}
