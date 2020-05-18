import { Radio } from "antd";
import { range } from "d3-array";
import React, { Component } from "react";
import {
	AreaSparklineChart,
	ChartZoomPan,
	ChartBrush,
	LinearXAxis,
	LinearXAxisTickLabel,
	LinearXAxisTickSeries,
} from "reaviz";
import { csv } from "d3";

function debounce(func, wait, immediate) {
	var timeout;
	return function () {
		var context = this,
			args = arguments;
		var later = function () {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}

export class RidgelinePlot extends Component {
	state = {
		domain: [new Date(2013, 3, 1), new Date(2013, 6, 10)],
		data: undefined,
	};

	onBrushChange = ({ domain }) => {
		debounce(
			this.setState({
				domain,
			}),
			100
		);
	};

	componentDidMount() {
		const startUser = 0;
		const endUser = 59;

		const getUserId = (u) => {
			return u.slice(-2);
		};

		csv(
			"https://raw.githubusercontent.com/yarncraft/learninginsights/master/src/dataset/stress.csv",
			(data) => {
				const filteredData = data.filter(
					(o) =>
						getUserId(o["User"]) >= startUser && getUserId(o["User"]) <= endUser
				);

				let currentUserId = startUser;
				let dataArray = [];
				let tempArray = [];
				for (let d in filteredData) {
					d = filteredData[d];
					let userId = getUserId(d["User"]);
					if (userId !== currentUserId) {
						dataArray.push(tempArray);
						tempArray = [];
						currentUserId = userId;
					}
					tempArray.push({
						key: new Date(+d["Time"] * 1000),
						data: parseFloat(d["Value"]) / 4,
						user: parseInt(userId),
					});
				}

				dataArray = dataArray
					.filter((e) => e.length > 30)
					.sort(function (a, b) {
						return (
							b[0].key - b[b.length - 1].key - (a[0].key - a[a.length - 1].key)
						);
					})
					.slice(1, 11);

				this.setState({
					data: dataArray,
					domain: [
						new Date(2013, 3, 1),
						Math.max(...dataArray.flat().map((o) => o.key), 0),
					],
				});
			}
		);
	}

	onChange = (e) => {
		const startUser = 0;
		const endUser = 59;

		const getUserId = (u) => {
			return u.slice(-2);
		};

		csv(e.target.value, (data) => {
			const filteredData = data.filter(
				(o) =>
					getUserId(o["User"]) >= startUser && getUserId(o["User"]) <= endUser
			);
			let amount = e.target.value.includes("stress") ? 13 : 10;
			let currentUserId = startUser;
			let dataArray = [];
			let tempArray = [];
			for (let d in filteredData) {
				d = filteredData[d];
				let userId = getUserId(d["User"]);
				if (userId !== currentUserId) {
					dataArray.push(tempArray);
					tempArray = [];
					currentUserId = userId;
				}
				tempArray.push({
					key: new Date(+d["Time"] * 1000),
					data: parseFloat(d["Value"]) / 4,
					user: parseInt(userId),
				});
			}

			dataArray = dataArray
				.filter((e) => e.length > 30)
				.sort(function (a, b) {
					return (
						a[0].key - a[a.length - 1].key - (b[0].key - b[b.length - 1].key)
					);
				})
				.slice(1, amount);

			this.setState({
				data: dataArray,
				domain: [
					new Date(2013, 3, 1),
					Math.max(...dataArray.flat().map((o) => o.key), 0),
				],
			});
		});
	};

	render() {
		const { data, domain } = this.state;

		if (data !== undefined) {
			return (
				<>
					<div>
						<Radio.Group
							defaultValue="https://raw.githubusercontent.com/yarncraft/learninginsights/master/src/dataset/stress.csv"
							onChange={this.onChange}
						>
							<Radio.Button value="https://raw.githubusercontent.com/yarncraft/learninginsights/master/src/dataset/stress.csv">
								Stress
							</Radio.Button>
							<Radio.Button value="https://raw.githubusercontent.com/yarncraft/learninginsights/master/src/dataset/sleep.csv">
								Sleep
							</Radio.Button>
						</Radio.Group>
					</div>
					<p> </p>
					{range(data.length).map((i) => {
						return i === 0 ? (
							<>
								<code className="studentinfo">Student {data[i][0].user}</code>
								<AreaSparklineChart
									className="chart-ridgeline-first"
									zoomPan={
										<ChartZoomPan
											disabled={true}
											onZoomPan={this.onBrushChange}
											domain={domain}
										/>
									}
									height={Math.max(...data[i].map((o) => o.data), 0) * 75}
									data={data[i]}
								/>
							</>
						) : (
							<>
								<code className="studentinfo">Student {data[i][0].user}</code>
								<AreaSparklineChart
									zoomPan={
										<ChartZoomPan
											disabled={true}
											onZoomPan={this.onBrushChange}
											domain={domain}
										/>
									}
									className="chart-ridgeline"
									height={Math.max(...data[i].map((o) => o.data), 0) * 75}
									data={data[i]}
								/>
							</>
						);
					})}
					<code>
						{" "}
						During the spring term, students were able to self-reflect on
						several measures by the use of the smartphone application. We sample
						the normalized levels of reflections from the students who responded
						at least 30 times in order to give a realistic depiction of term.
						The ridgeline plot gives intuitive insights in possible trends that
						can occur during a same time window. You can create a time window by
						click & drag with the brush tool below 👇
					</code>
					<AreaSparklineChart
						brush={
							<ChartBrush disabled={false} onBrushChange={this.onBrushChange} />
						}
						xAxis={
							<LinearXAxis
								type="time"
								tickSeries={
									<LinearXAxisTickSeries
										className="brush-label"
										label={<LinearXAxisTickLabel rotation={false} />}
									/>
								}
							/>
						}
						className="chart-ridgeline-brush"
						height={50}
						data={data[0]}
					/>
				</>
			);
		} else {
			return (
				<Radio.Group onChange={this.onChange}>
					<Radio.Button value="https://raw.githubusercontent.com/yarncraft/learninginsights/master/src/dataset/stress.csv">
						Stress
					</Radio.Button>
					<Radio.Button value="https://raw.githubusercontent.com/yarncraft/learninginsights/master/src/dataset/sleep.csv">
						Sleep
					</Radio.Button>
				</Radio.Group>
			);
		}
	}
}
