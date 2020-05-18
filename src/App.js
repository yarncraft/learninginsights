import { Card, Col, Layout, Row, Tabs, notification, Popover } from "antd";
import React from "react";
import "./App.css";
import { RidgelinePlot } from "./RidgelinePlot";
import { SankeyChart } from "./SankeyChart";
import ViolinPlot from "./ViolinPlot";
import { GithubOutlined } from "@ant-design/icons";

const { Header, Content, Footer } = Layout;
const { TabPane } = Tabs;

const msg1 = {
	message: "Welcome visitor 👋",
	description: "Start charting by selecting data from the dropdowns!",
	duration: 12,
	placement: "topLeft",
};

const msg2 = {
	message: "Chart usage 👉",
	description:
		"You can find additional information at the bottom of the charts.",
	duration: 12,
	placement: "bottomLeft",
};

const msg3 = {
	message: "👈 Info about the data",
	description:
		"You can discover more about the data itself by hovering on the chart titles.",
	duration: 12,
	placement: "topRight",
};

setTimeout(() => notification.open(msg1), 5000);
setTimeout(() => notification.open(msg2), 10000);
setTimeout(() => notification.open(msg3), 15000);

const App = () => (
	<Layout style={{ height: "107vh", borderRight: 0 }}>
		<Header className="site-layout-sub-header-background">
			<div className="neon">
				{" "}
				Learning Insights Dashboard{" "}
				<a href="https://github.com/yarncraft/learninginsights">
					{" "}
					<GithubOutlined />
				</a>
			</div>
		</Header>
		<Content
			style={{
				height: "100vh",
				margin: "24px 24px",
			}}
		>
			<Row gutter={[0, 0]} style={{ height: "100%", fontSiz: "32px" }}>
				<Col span={8}>
					<Card
						style={{ height: "100%", borderRight: 0 }}
						title={
							<Popover
								content={
									"Online activity data entails participants' usage data of the Piazza digital platform."
								}
								trigger="hover"
								placement="top"
							>
								<text>💻 Online Activity & Binned GPA </text>
							</Popover>
						}
						bordered={true}
					>
						<ViolinPlot />
					</Card>
				</Col>
				<Col span={8}>
					<Card
						style={{ height: "100%" }}
						title={
							<Popover
								style={{ width: "30%" }}
								content={
									"Survey responses contain participants's responses to both pre and post mental health measures."
								}
								trigger="hover"
								placement="top"
							>
								<text>📋 Pre-Post Survey Flow</text>
							</Popover>
						}
						bordered={true}
					>
						<Tabs type="card">
							<TabPane tab="Big Five Survey" resource={" "} key="2">
								<SankeyChart />
							</TabPane>
						</Tabs>
					</Card>
				</Col>
				<Col span={8}>
					<Card
						style={{ height: "100%" }}
						title={
							<Popover
								content={
									"Online activity data entails participants' usage data of the Piazza digital platform."
								}
								trigger="hover"
								placement="top"
							>
								<text>📆 Normalized Levels over Time</text>
							</Popover>
						}
						bordered={false}
					>
						<RidgelinePlot />
					</Card>
				</Col>
			</Row>
		</Content>
		<Footer style={{ textAlign: "center" }} />
	</Layout>
	// </Layout>
);

export default App;
