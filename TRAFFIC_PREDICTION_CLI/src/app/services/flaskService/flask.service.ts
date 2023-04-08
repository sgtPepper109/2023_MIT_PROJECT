import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PropService } from '../propService/prop.service';

@Injectable({
	providedIn: 'root'
})
export class FlaskService {
	constructor(private http: HttpClient, private propService: PropService) { }

	public getPlot() {
		return this.http.get('process/getPlot')
	}

	public sendCsvData(csvData: object) {
		return this.http.post('process/setCsvData', csvData)
	}

	public getActualPredictedForPlot() {
		return this.http.get('process/getActualPredictedForPlot')
	}

	public getModelSummary() {
		return this.http.get('process/getModelSummary')
	}
	
	public getAccuracies() {
		return this.http.get('process/getAccuracies')
	}

	public sendTrainingSpecifics(trainingSpecifics: Object) {
		return this.http.post('process/sendTrainingSpecifics', trainingSpecifics)
	}

	public storeCsvData(csvData: any) {
		return this.http.post('csvInstance/addCsvInstances', csvData)
	}

	public train() {
		return this.http.get('process/train')
	}

	public sendInputTimeToPredict(predict: object) {
		return this.http.post('process/sendInputTimeToPredict', predict)
	}

	public predictAgainstTime() {
		return this.http.get('process/predictAgainstTime')
	}

	public getFuturePredictionsTable() {
		return this.http.get('process/getFuturePredictionsTable')
	}

	public predictAllJunctions() {
		return this.http.get('process/predictAllJunctions')
	}

	public getAllJunctionsFuturePredictionsTable() {
		return this.http.get('process/getAllJunctionsFuturePredictionsTable')
	}

	public getAccuraciesOfAllJunctions() {
		return this.http.get('process/getAccuraciesOfAllJunctions')
	}

	public getAllUniqueJunctions() {
		return this.http.get('process/getAllUniqueJunctions')
	}

	public getListOfAllTrained() {
		return this.http.get('process/getListOfAllTrained')
	}

	public getTestingRatioComparisons(action: string, junction: string) {
		return this.http.get('process/getTestingRatioComparisons?action=' + action + '&junction=' + junction)
	}

	public addToMaster(
		junction: string, 
		algorithm: string, 
		testRatio: number,
		startYear: number
	) {
		return this.http.get('process/addToMaster'
			+ '?junction=' + junction 
			+ '&algorithm=' + algorithm 
			+ '&testRatio=' + testRatio 
			+ '&startYear=' + startYear
		)
	}

	public getRelativeChange(factor: string, junction: string) {
		return this.http.get('process/getRelativeChange?factor=' + factor + '&junction=' + junction)
	}

	public getAllRelativeChange() {
		return this.http.get('process/getAllRelativeChange')
	}

	public getMasterTrainedDataPlot() {
		return this.http.get('process/getMasterTrainedDataPlot')
	}

	public getMasterTrainedDataForTable() {
		return this.http.get('process/getMasterTrainedDataTable')
	}
	
	public getMasterTrainedJunctionsAccuracies() {
		return this.http.get('process/getMasterTrainedJunctionsAccuracies')
	}

	public predictForHighestAccuracy(junction: string, algorithm: string, testRatio: number) {
		return this.http.get('process/predictForHighestAccuracy?junction=' + junction + '&algorithm=' + algorithm + '&testRatio=' + testRatio)
	}
	
	public checkIfTrained(junction: string) {
		return this.http.get('process/checkIfTrained?junction=' + junction)
	}

	public getActualVsPredictedComparison() {
		return this.http.get('process/getActualVsPredictedComparison')
	}

	public getActualVsPredictedComparisonTableData() {
		return this.http.get('process/getActualVsPredictedComparisonTableData')
	}

	public getAllModelSummaries() {
		return this.http.get('process/getAllModelSummaries')
	}

	public getDaysPrediction() {
		return this.http.get('process/getDaysPrediction')
	}

	public checkIfJunctionDataExists() {
		return this.http.get('process/checkIfJunctionDataExists')
	}

	public getJunctionFromRecommended(junction: string) {
		return this.http.get('recommended/getJunctionInstances?junction=' + junction)
	}

	public storeRecommendation(recommended: Object) {
		return this.http.post('recommended/addRecommended', recommended)
	}

	public increaseDistrictTreatmentCount(districtName: string) {
		return this.http.get('districtTreatmentCount/increaseDistrictTreatmentCount?districtName=' + districtName)
	}

	public getAllAlgorithms() {
		return this.http.get('process/getAllAlgorithms')
	}

	public getEndYearFromDataset() {
		return this.http.get('process/getEndYearFromDataset')
	}

	public getAllDistrictTreatmentCounts() {
		return this.http.get('districtTreatmentCount/getAllDistrictTreatmentCounts')
	}

	public clearDistrictTreatmentCounts() {
		return this.http.get('districtTreatmentCount/clearAllDistrictTreatmentCounts')
	}
	
	public clearAllRecommended() {
		return this.http.get('recommended/clearAllRecommended')
	}

	public deleteRecommendation(junction: string, district: string) {
		return this.http.get('recommended/deleteRecommendation?junction=' + junction + '&district=' + district)
	}

	public decreaseDistrictTreatmentCount(district: string) {
		return this.http.get('districtTreatmentCount/decreaseDistrictTreatmentCount?districtName=' + district)
	}

}
