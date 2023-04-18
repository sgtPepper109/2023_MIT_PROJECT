export interface tableRecord {
    junctionOrAlgorithm: string,
    accuracy: unknown,
}

export interface JunctionDistrictMap {
    junctionName: string
    district: string
}

export interface JunctionInformation {
    junctionName: string
    district: string
    roadwayWidth: number
    maxVehicles: number
}

export interface JunctionRoadwayWidthMap {
    junctionName: string
    roadwayWidth: number
}

export interface RoadwayWidthMaxVehiclesMap {
    roadwayWidth: number;
    maxVehicles: number;
}

export interface csvInstance {
    dateTime: string,
    junction: string,
    vehicles: number
}

export interface trainingDetails {
	junction: string,
	testRatio: number,
	algorithm: string
}

export interface User {
    name: string,
    email: string,
    password: string,
    role: string,
    active: boolean
}

export interface mapDataInstance {
    name: string,
    value: number
}


export interface treeInstance {
    name: string,
    children?: Array<treeInstance>
}