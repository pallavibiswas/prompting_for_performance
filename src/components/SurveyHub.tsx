import { useEffect, useMemo, useState } from "react";
import { useInView } from "../hooks/useInView";
import { useMarkdown } from "../hooks/useMarkdown";
import { CHART_COLORS } from "../lib/craftDefs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import "../styles/SurveyHub.css";

interface SurveyRow {
  label: string;
  value: number;
  pct: string;
}

interface SurveyChart {
  title: string;
  n: string;
  question: string;
  type: "bar" | "stacked";
  rows: SurveyRow[];
}

interface SurveyTab {
  title: string;
  charts: SurveyChart[];
}

const LIKERT_COLORS = [
  "#1A73E8",
  "#4A9FFF",
  "#64748B",
  "#F59E0B",
  "#EF4444",
];

function parseSurveyMarkdown(raw: string): SurveyTab[] {
  const tabs: SurveyTab[] = [];
  const tabBlocks = raw.split(/\n##\s+/).slice(1);

  for (const tabBlock of tabBlocks) {
    const tabLines = tabBlock.split("\n");
    const tabTitle = tabLines[0]?.trim() || "";
    const charts: SurveyChart[] = [];

    const chartBlocks = tabBlock.split(/\n###\s+/).slice(1);

    for (const chartBlock of chartBlocks) {
      const lines = chartBlock.split("\n");
      const chartTitle = lines[0]?.trim() || "";

      const nLine = lines.find(line =>
        line.trim().startsWith("n:")
      );

      const questionLine = lines.find(line =>
        line.trim().startsWith("Q:")
      );

      const typeLine = lines.find(line =>
        line.trim().startsWith("type:")
      );

      const n = nLine
        ? nLine.replace(/^n:/, "").trim()
        : "";

      const question = questionLine
        ? questionLine.replace(/^Q:/, "").trim()
        : "";

      const parsedType = typeLine
        ? typeLine.replace(/^type:/, "").trim()
        : "bar";

      const type: SurveyChart["type"] =
        parsedType === "stacked" ? "stacked" : "bar";

      const tableLines = lines.filter(line => {
        const trimmed = line.trim();

        return (
          trimmed.startsWith("|") &&
          !/^\|[\s|:-]+\|$/.test(trimmed)
        );
      });

      const rows = tableLines
        .slice(1)
        .map(line => {
          const cells = line
            .split("|")
            .map(cell => cell.trim())
            .filter(Boolean);

          const value = Number.parseFloat(cells[1]);

          return {
            label: cells[0] || "",
            value: Number.isFinite(value) ? value : 0,
            pct: cells[2] || `${cells[1] || 0}%`,
          };
        })
        .filter(row => row.label);

      if (chartTitle && rows.length > 0) {
        charts.push({
          title: chartTitle,
          n,
          question,
          type,
          rows,
        });
      }
    }

    if (tabTitle) {
      tabs.push({
        title: tabTitle,
        charts,
      });
    }
  }

  return tabs;
}

function useMobileBreakpoint(maxWidth = 640) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(
      `(max-width: ${maxWidth}px)`
    );

    const update = () => {
      setIsMobile(query.matches);
    };

    update();
    query.addEventListener("change", update);

    return () => {
      query.removeEventListener("change", update);
    };
  }, [maxWidth]);

  return isMobile;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: {
    value: number;
    payload: {
      pct?: string;
    };
    name?: string;
    color?: string;
  }[];
  label?: string;
}) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="survey-tooltip">
      {label && (
        <p className="survey-tooltip__label">
          {label}
        </p>
      )}

      {payload.map((entry, index) => (
        <div
          key={index}
          className="survey-tooltip__row"
        >
          <span
            className="survey-tooltip__swatch"
            style={{
              background: entry.color,
            }}
          />

          <span className="survey-tooltip__name">
            {entry.name || entry.payload.pct}:
          </span>

          <span className="survey-tooltip__value">
            {entry.value}%
          </span>
        </div>
      ))}
    </div>
  );
}

function FrequencyChart({
  chart,
  isMobile,
}: {
  chart: SurveyChart;
  isMobile: boolean;
}) {
  const isHorizontal = chart.rows.some(
    row => row.label.length > 12
  );

  const horizontalHeight = Math.max(
    isMobile ? 240 : 200,
    chart.rows.length * (isMobile ? 58 : 48)
  );

  const verticalHeight = isMobile ? 300 : 240;

  return (
    <article className="survey-chart">
      <h3 className="survey-chart__title">
        {chart.title}
      </h3>

      <p className="survey-chart__question">
        {chart.question}
        {chart.n && (
          <span className="survey-chart__sample">
            {" "}
            (n={chart.n})
          </span>
        )}
      </p>

      {isHorizontal ? (
        <div className="survey-chart__canvas survey-chart__canvas--horizontal">
          <ResponsiveContainer
            width="100%"
            height={horizontalHeight}
          >
            <BarChart
              data={chart.rows}
              layout="vertical"
              margin={{
                left: 0,
                right: isMobile ? 44 : 56,
                top: 4,
                bottom: 4,
              }}
            >
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{
                  fill: "#64748B",
                  fontSize: isMobile ? 9 : 11,
                }}
                tickFormatter={value => `${value}%`}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                type="category"
                dataKey="label"
                width={isMobile ? 104 : 160}
                tick={{
                  fill: "#94A3B8",
                  fontSize: isMobile ? 10 : 12,
                  fontFamily: "Inter, sans-serif",
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip content={<CustomTooltip />} />

              <Bar
                dataKey="value"
                radius={[0, 4, 4, 0]}
                barSize={isMobile ? 20 : 24}
              >
                {chart.rows.map((_, index) => (
                  <Cell
                    key={index}
                    fill={
                      CHART_COLORS[
                        index % CHART_COLORS.length
                      ]
                    }
                  />
                ))}

                <LabelList
                  dataKey="pct"
                  position="right"
                  style={{
                    fill: "#94A3B8",
                    fontSize: isMobile ? 9 : 11,
                    fontFamily:
                      "JetBrains Mono, monospace",
                  }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <>
          <div className="survey-chart__canvas">
            <ResponsiveContainer
              width="100%"
              height={verticalHeight}
            >
              <BarChart
                data={chart.rows}
                margin={{
                  top: 16,
                  right: isMobile ? 4 : 16,
                  bottom: isMobile ? 34 : 8,
                  left: isMobile ? -18 : 8,
                }}
              >
                <XAxis
                  dataKey="label"
                  interval={0}
                  angle={isMobile ? -28 : 0}
                  textAnchor={
                    isMobile ? "end" : "middle"
                  }
                  height={isMobile ? 64 : 30}
                  tick={{
                    fill: "#94A3B8",
                    fontSize: isMobile ? 9 : 12,
                    fontFamily: "Inter, sans-serif",
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  domain={[0, 100]}
                  width={isMobile ? 36 : 60}
                  tick={{
                    fill: "#64748B",
                    fontSize: isMobile ? 9 : 11,
                  }}
                  tickFormatter={value => `${value}%`}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip content={<CustomTooltip />} />

                <Bar
                  dataKey="value"
                  radius={[5, 5, 0, 0]}
                  maxBarSize={isMobile ? 44 : 64}
                >
                  {chart.rows.map((_, index) => (
                    <Cell
                      key={index}
                      fill={
                        CHART_COLORS[
                          index % CHART_COLORS.length
                        ]
                      }
                    />
                  ))}

                  <LabelList
                    dataKey="pct"
                    position="top"
                    style={{
                      fill: "#94A3B8",
                      fontSize: isMobile ? 9 : 11,
                      fontFamily:
                        "JetBrains Mono, monospace",
                    }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="survey-legend">
            {chart.rows.map((row, index) => (
              <div
                key={index}
                className="survey-legend__item"
              >
                <span
                  className="survey-legend__swatch"
                  style={{
                    background:
                      CHART_COLORS[
                        index % CHART_COLORS.length
                      ],
                  }}
                />

                <span className="survey-legend__label">
                  {row.label}:
                </span>

                <span className="survey-legend__value">
                  {row.pct}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </article>
  );
}

function StackedChart({
  chart,
}: {
  chart: SurveyChart;
}) {
  const visibleRows = chart.rows.filter(
    row => row.value > 0
  );

  return (
    <article className="survey-chart survey-chart--stacked">
      <h3 className="survey-chart__title">
        {chart.title}
      </h3>

      <p className="survey-chart__question">
        {chart.question}
        {chart.n && (
          <span className="survey-chart__sample">
            {" "}
            (n={chart.n})
          </span>
        )}
      </p>

      <div
        className="survey-stacked"
        role="img"
        aria-label={`${chart.title} response distribution`}
      >
        {visibleRows.map((row, index) => (
          <div
            key={row.label}
            className="survey-stacked__segment"
            title={`${row.label}: ${row.pct}`}
            style={{
              width: `${row.value}%`,
              background:
                LIKERT_COLORS[
                  index % LIKERT_COLORS.length
                ],
            }}
          >
            {row.value > 10 && (
              <span>{row.pct}</span>
            )}
          </div>
        ))}
      </div>

      <div className="survey-legend survey-legend--likert">
        {chart.rows.map((row, index) => (
          <div
            key={row.label}
            className="survey-legend__item"
          >
            <span
              className="survey-legend__swatch"
              style={{
                background:
                  LIKERT_COLORS[
                    index % LIKERT_COLORS.length
                  ],
              }}
            />

            <span className="survey-legend__label">
              {row.label}:
            </span>

            <span className="survey-legend__value">
              {row.pct}
            </span>
          </div>
        ))}
      </div>
    </article>
  );
}

export default function SurveyHub() {
  const [ref, inView] = useInView();
  const [activeTab, setActiveTab] = useState(0);
  const isMobile = useMobileBreakpoint();

  const markdownPath = `${import.meta.env.BASE_URL}content/survey-data.md`;
  const { raw, loading, error } =
    useMarkdown(markdownPath);

  const tabs = useMemo(
    () => parseSurveyMarkdown(raw),
    [raw]
  );

  const currentTab = tabs[activeTab];

  useEffect(() => {
    if (
      tabs.length > 0 &&
      activeTab >= tabs.length
    ) {
      setActiveTab(0);
    }
  }, [activeTab, tabs.length]);

  return (
    <section
      id="survey"
      ref={ref}
      className="survey"
    >
      <div className="survey__container">
        <p className="survey__eyebrow">
          03 / Survey Hub
        </p>

        <h2 className="survey__heading">
          Data in numbers
        </h2>

        <p className="survey__intro">
          51 JPMorganChase respondents across North
          America, London, APAC, and Mumbai.
        </p>

        <div className="survey-tabs-wrapper">
          <div
            className="survey-tabs"
            role="tablist"
            aria-label="Survey categories"
          >
            {loading ? (
              <div className="survey-tabs__loading">
                Loading…
              </div>
            ) : (
              tabs.map((tab, index) => (
                <button
                  key={tab.title}
                  type="button"
                  role="tab"
                  aria-selected={
                    activeTab === index
                  }
                  className={`survey-tabs__button ${
                    activeTab === index
                      ? "survey-tabs__button--active"
                      : ""
                  }`}
                  onClick={() =>
                    setActiveTab(index)
                  }
                >
                  {tab.title}
                </button>
              ))
            )}
          </div>
        </div>

        <div
          className="survey__charts"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView
              ? "translateY(0)"
              : "translateY(18px)",
            transition:
              "opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s",
          }}
        >
          {loading && (
            <p className="survey__status">
              Loading survey data…
            </p>
          )}

          {!loading && error && (
            <p className="survey__status survey__status--error">
              {error}
            </p>
          )}

          {!loading &&
            !error &&
            !currentTab && (
              <p className="survey__status">
                No survey data found.
              </p>
            )}

          {!loading &&
            currentTab?.charts.map(
              (chart, index) =>
                chart.type === "stacked" ? (
                  <StackedChart
                    key={`${chart.title}-${index}`}
                    chart={chart}
                  />
                ) : (
                  <FrequencyChart
                    key={`${chart.title}-${index}`}
                    chart={chart}
                    isMobile={isMobile}
                  />
                )
            )}
        </div>
      </div>
    </section>
  );
}