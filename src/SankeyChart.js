import React, { Component } from "react";
import { Sankey, SankeyLink, SankeyNode } from "reaviz";
import chroma from "chroma-js";
import { Select } from "antd";
import { csv } from "d3";

const { Option } = Select;

const schemes = {
	cybertron: chroma.scale(["purple", "orange"]).correctLightness().colors(5),
	...chroma.brewer,
};

const color = schemes.cybertron;

export class SankeyChart extends Component {
	state = {
		data: [],
	};

	handleChange = async (value) => {
		await csv(value, (links) => {
			this.setState({
				data: links.filter((x) => x.value > 0),
			});
		});
	};

	render() {
		const { data } = this.state;

		return (
			<>
				<Select
					style={{ width: 300, fontSize: "14px" }}
					placeholder="Choose Survey Question"
					optionFilterProp="children"
					onChange={this.handleChange}
				>
					<Option value="https://raw.githubusercontent.com/yarncraft/learninginsights/master/src/dataset/bigfive/worriesSankey.csv">
						I am feeling worried right now
					</Option>
					<Option value="https://raw.githubusercontent.com/yarncraft/learninginsights/master/src/dataset/bigfive/sociableSankey.csv">
						I am sociable right now
					</Option>
					<Option value="https://raw.githubusercontent.com/yarncraft/learninginsights/master/src/dataset/bigfive/nervousSankey.csv">
						I am nervous right now
					</Option>
					<Option value="https://raw.githubusercontent.com/yarncraft/learninginsights/master/src/dataset/bigfive/efficientSankey.csv">
						I am efficient right now
					</Option>
				</Select>
				<Sankey
					height={620}
					width={400}
					nodes={[
						<SankeyNode color={color[0]} title="Disagree strongly" id="0" />,
						<SankeyNode color={color[1]} title="Disagree a little" id="1" />,
						<SankeyNode
							color={color[2]}
							title="Neither agree nor disagree"
							id="2"
						/>,
						<SankeyNode color={color[3]} title="Agree a little" id="3" />,
						<SankeyNode color={color[4]} title="Agree strongly" id="4" />,
						<SankeyNode color={color[0]} title="Disagree strongly" id="5" />,
						<SankeyNode color={color[1]} title="Disagree a little" id="6" />,
						<SankeyNode
							color={color[2]}
							title="Neither agree nor disagree"
							id="7"
						/>,
						<SankeyNode color={color[3]} title="Agree a little" id="8" />,
						<SankeyNode color={color[4]} title="Agree strongly" id="9" />,
					]}
					links={
						data === undefined
							? []
							: data.map((link) => (
									<SankeyLink
										source={link.source}
										target={String(parseInt(link.target) + 5)}
										value={link.value}
										gradient={true}
									/>
							  ))
					}
				/>
				<p> </p>
				<code>
					{" "}
					The students undertook a survey before and after the
					learning-analytics experiment. With this chart you can observe changes
					in mental health measures pre/post this experiment which took place
					during the spring term (ten weeks). The responses of students are
					aggregated in a Sankey flow. This yields an intuitive tool to discover
					trends possibly correlated with the academic journey.
				</code>
			</>
		);
	}
}
