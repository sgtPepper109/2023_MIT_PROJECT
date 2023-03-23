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