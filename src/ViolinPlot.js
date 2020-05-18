import React, { Component } from "react";
import OrdinalFrame from "semiotic/lib/OrdinalFrame";
import { Radio, Select, Slider } from "antd";
import { csv } from "d3";

const { Option } = Select;

const colors = {
	U: "#bfbfbf",
	B: "#1768ff",
	A: "#44c767",
};

const frameProps = {
	margin: { left: 60, bottom: 80, right: 140, top: 20 },
	axes: [
		{
			orient: "bottom",
			className: "testax",
			label: "Normalized Value",
			tickFormat: function (e) {
				return e + "%";
			},
		},
	],
	type: "point",
	projection: "horizontal",
	oAccessor: "grade",
	rAccessor: "rank",
	rExtent: [0, 100],
	style: (d) => {
		return {
			r: 2,
			fill: d && colors[d.grade],
		};
	},
	summaryStyle: (d) => ({
		fill: d && colors[d.grade],
		fillOpacity: 0.4,
		stroke: d && colors[d.grade],
		strokeWidth: 0.7,
	}),
	tooltipContent: (d) => (
		<div className="tooltip-content">
			<p>
				Student {d.id} <br /> {d.type}: {Math.round(d.val)} <br /> Value (%):{" "}
				{Math.round(d.rank)} <br /> GPA: {d.gradeValue}
			</p>
		</div>
	),
};

export default class Special extends Component {
	state = {
		chartType: "violin",
		width: 600,
		height: 720,
		data: [],
		breakpoint: 3.5,
	};

	/**
	 * Calculate & Update state of new dimensions
	 */
	updateDimensions() {
		if (window.innerWidth < 500) {
			this.setState({ width: 450, height: 102 });
		} else {
			let update_width = window.innerWidth / 3;
			let update_height = window.innerHeight / 1.6;
			this.setState({ width: update_width, height: update_height });
		}
	}

	/**
	 * Add event listener
	 */
	componentDidMount() {
		this.updateDimensions();
		window.addEventListener("resize", this.updateDimensions.bind(this));
	}

	/**
	 * Remove event listener
	 */
	componentWillUnmount() {
		window.removeEventListener("resize", this.updateDimensions.bind(this));
	}

	onChange = (e) => {
		this.setState({
			chartType: e.target.value,
		});
	};

	handleChange = async (value) => {
		let measurements = [];
		await csv(value, (data) => {
			data
				.sort((a, b) => Number(a.gradesTotal) - Number(b.gradesTotal))
				.map(({ gradesTotal, studentNr, type, valueA, valueR }) =>
					measurements.push({
						id: studentNr,
						grade: Number(gradesTotal).toFixed(1),
						gradeValue: Number(gradesTotal),
						rank: valueR,
						val: valueA,
						type,
					})
				);
			this.setState({ data: measurements });
			//this.forceUpdate();
		});
	};

	onAfterChange = (value) => {
		this.setState({ breakpoint: value });
	};

	render() {
		const { chartType, width, height, data, breakpoint } = this.state;

		let l = data.map(({ grade, gradeValue, id, rank, val, type }) => ({
			grade: `${gradeValue == -1 ? "U" : gradeValue < breakpoint ? "B" : "A"}`,
			gradeValue,
			id,
			rank,
			val,
			type,
		}));

		return (
			<>
				<Select
					style={{ width: 130, fontSize: "10px" }}
					placeholder="Choose Predictor"
					optionFilterProp="children"
					onChange={this.handleChange}
				>
					<Option value="https://raw.githubusercontent.com/yarncraft/learninginsights/master/src/dataset/daysonline.csv">
						Days online
					</Option>
					<Option value="https://raw.githubusercontent.com/yarncraft/learninginsights/master/src/dataset/contributions.csv">
						Contributions
					</Option>
					<Option value="https://raw.githubusercontent.com/yarncraft/learninginsights/master/src/dataset/views.csv">
						Pageviews
					</Option>
					<Option value="https://raw.githubusercontent.com/yarncraft/learninginsights/master/src/dataset/deadlines.csv">
						Deadlines
					</Option>
				</Select>
				<Radio.Group defaultValue="violin" onChange={this.onChange}>
					<Radio.Button value="boxplot">Boxplot</Radio.Button>
					<Radio.Button value="violin">Violinplot</Radio.Button>
					<Radio.Button value="ridgeline">Ridgeline</Radio.Button>
					<Radio.Button value="heatmap">Heatmap</Radio.Button>
				</Radio.Group>
				<Slider
					tooltipPlacement={"bottom"}
					tipFormatter={(value) => `GPA Treshold: ${value}`}
					marks={{
						2: "Passing Grade",
						2.8: "Cum Fructu",
						3.5: "Cum Laude",
					}}
					step={0.1}
					max={3.5}
					min={2}
					style={{
						width: "80%",
						color: "yellow",
						marginLeft: "auto",
						marginRight: "auto",
					}}
					defaultValue={3.5}
					onAfterChange={this.onAfterChange}
				/>
				<OrdinalFrame
					data={l}
					oSort={(a, b) => a < b}
					summaryType={chartType}
					size={[width, height + 20]}
					oLabel={(d) => (
						<text className={"gpa"}>
							{d === "U"
								? "GPA Undefined"
								: d === "B"
								? `GPA < ${breakpoint}`
								: `GPA > ${breakpoint}`}
						</text>
					)}
					pieceHoverAnnotation={{ onlyPieces: true }}
					{...frameProps}
					pieceIDAccessor="rank"
				/>
				<p> </p>
				<code>
					{" "}
					With this chart you can discover how the online activity of students
					correlate to the overall GPA. The values are normalized to a relative
					percentage. First select a predictor from the dropdown. Via the
					slider, can set a GPA treshold which bins the students in two groups:
					those with a GPA lower than the treshold and those with a better GPA.
					You can select the plot of preference via the buttons.
				</code>
			</>
		);
	}
}
