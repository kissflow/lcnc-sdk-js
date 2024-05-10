export type userObject = {
	_id: string;
	Name: string;
	Email: string;
	Role: string;
};

export type accountObject = {
	_id: string;
};

export type environmentObject = {
	isMobile: boolean
}

export type BoardItem = {
	_id: string;
}

export type DataformItem = {
	_id: string;
}

export type ProcessItem = {
	_id: string;
	_activity_instance_id: string;
}

export type FetchOptions = {
	method: string,
	body: string | object;
	headers: object;
}