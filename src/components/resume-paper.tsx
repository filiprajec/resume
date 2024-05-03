import React, { useRef, forwardRef, useImperativeHandle } from "react";
import styled from "styled-components";
import { Rings } from "react-loader-spinner";
import { ExclamationCircleIcon } from "@heroicons/react/outline";

import { useZoom, useTheme } from "../context";
import { TimeLineCell } from "./time-line-cell";
import { SectionCell } from "./section-cell";
import { BasicsCell } from "./basics-cell";
import { ResumeSections, ResumeSettings } from "../hooks";
import { ResumeSchema } from "../types";
import { ColumnLayout } from "./column-layout";
import { Cell } from "./cell";
import { RowLayout } from "./row-layout";
import { Grid } from "./grid";

interface ResumePaperProps {
  resumeSections?: ResumeSections;
  resumeJson?: Omit<ResumeSchema, "basics"> & {
    basics: ResumeSchema["basics"] | undefined;
  };
  headings?: ResumeSettings["headings"];
  ratingBarData?: ResumeSettings["ratingBarData"];
  errorMessage?: string;
  isLoading?: boolean;
}

export type ResumePaperRef = {
  outer: HTMLDivElement | null;
  inner: HTMLDivElement | null;
};

export const ResumePaper = forwardRef<ResumePaperRef, ResumePaperProps>(
  (
    {
      resumeSections = {},
      resumeJson = {},
      headings = {},
      ratingBarData,
      errorMessage = "",
      isLoading = false,
    },
    ref
  ) => {
    const { zoom, rendering } = useZoom();
    const theme = useTheme();
    const outerRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);

    useImperativeHandle<ResumePaperRef, ResumePaperRef>(
      ref,
      () => ({
        outer: outerRef.current,
        inner: innerRef.current,
      }),
      [outerRef, innerRef, errorMessage]
    );

    if (errorMessage !== "") {
      return (
        <Paper background={theme.colors.white}>
          <ErrorPage />
        </Paper>
      );
    }

    return (
      <Paper background={theme.colors.white}>
        {(isLoading || rendering) && <LoadingPage />}
        <PaperInner margin="20px" ref={outerRef}>
          <Grid ref={innerRef}>
            <ColumnLayout>
              <Cell
                fraction={1}
                style={{
                  backgroundColor:
                    theme.colorScheme.primary[theme.colorScheme.primaryShade],
                }}
              >
                <RowLayout>
                  {resumeJson?.basics && (
                    <BasicsCell basics={resumeJson.basics} />
                  )}
                  {resumeSections?.skills &&
                    resumeSections.skills.length > 0 && (
                      <SectionCell
                        heading={headings.skills}
                        ratingBarData={ratingBarData}
                        data={resumeSections.skills}
                        showMarkers={false}
                        showIcon={false}
                        styles={{
                          contentCell: {
                            container: {
                              paddingTop: `${zoom * 30}px`,
                            },
                          },
                          description: {
                            container: {
                              paddingBottom: 20,
                              textAlign: "left",
                            },
                          },
                        }}
                      />
                    )}
                  {resumeSections?.interests?.hasContent() && (
                    <SectionCell
                      heading={headings.interests}
                      data={resumeSections.interests}
                      showMarkers={false}
                      showIcon={false}
                    />
                  )}
                </RowLayout>
              </Cell>
              <Cell fraction={3}>
                <RowLayout>
                  <Cell>
                    <ColumnLayout>
                      <Cell>
                        <RowLayout>
                          {resumeSections?.work?.hasContent() && (
                            <TimeLineCell
                              heading={headings.work}
                              data={resumeSections.work}
                              showIcon={false}
                            />
                          )}
                          {resumeSections?.education?.hasContent() && (
                            <TimeLineCell
                              heading={headings.education}
                              data={resumeSections.education}
                              showIcon={false}
                            />
                          )}

                          {resumeSections?.awards?.hasContent() && (
                            <SectionCell
                              heading={headings.awards}
                              data={resumeSections.awards}
                              showIcon={false}
                            />
                          )}
                          {resumeSections?.publications?.hasContent() && (
                            <SectionCell
                              heading={headings.publications}
                              data={resumeSections.publications}
                              showIcon={false}
                            />
                          )}
                          {resumeSections?.projects?.hasContent() && (
                            <SectionCell
                              heading={headings.projects}
                              data={resumeSections.projects}
                              ratingBarData={ratingBarData}
                              showIcon={false}
                            />
                          )}
                          {resumeSections?.volunteer?.hasContent() && (
                            <TimeLineCell
                              heading={headings.volunteer}
                              data={resumeSections.volunteer}
                              showIcon={false}
                            />
                          )}
                        </RowLayout>
                      </Cell>
                    </ColumnLayout>
                  </Cell>

                  {resumeSections?.languages?.hasContent() && (
                    <SectionCell
                      heading={headings.languages}
                      data={resumeSections.languages}
                      ratingBarData={ratingBarData}
                      showIcon={false}
                    />
                  )}

                  {resumeSections?.references?.hasContent() && (
                    <SectionCell
                      heading={headings.references}
                      data={resumeSections.references}
                      showIcon={false}
                    />
                  )}
                </RowLayout>
              </Cell>
            </ColumnLayout>
          </Grid>
        </PaperInner>
      </Paper>
    );
  }
);

const LoadingPage = () => {
  const theme = useTheme();

  return (
    <FullPage background={theme.colors.white} style={{ zIndex: 2 }}>
      <Rings color="#c8c8c8" height={150} width={150} />
    </FullPage>
  );
};

const ErrorPage = () => {
  const theme = useTheme();

  return (
    <FullPage background={theme.colors.white}>
      <div style={{ height: 40, width: 40, color: "#c8c8c8" }}>
        <ExclamationCircleIcon />
      </div>
    </FullPage>
  );
};

const Paper = styled.div<{
  top?: React.CSSProperties["top"];
  background: React.CSSProperties["background"];
}>`
  display: block;
  position: relative;
  top: ${(props) => props.top ?? 0};
  width: 21cm;
  height: 29.5cm;
  margin: 0.25cm auto calc(0.25cm + ${(props) => props.top ?? "0cm"}) auto;
  box-shadow: 0 0 0.5cm rgba(0, 0, 0, 0.1);
  background: ${(props) => props.background};
  font-family: "Inter";
  line-height: 1.1;
  transition: all 0.1s ease-in-out;
  overflow: hidden;
  box-sizing: content-box;

  * {
    box-sizing: border-box;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p {
    margin: 0;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: "Karrik";
  }

  p {
    font-family: "Inter";
    margin: 0;
  }

  @media print {
    box-shadow: none;
    width: 21cm;
    height: 29.5cm;
    margin: 0;
    background: ${(props) => props.background};
    box-sizing: content-box;
  }
`;

const PaperInner = styled.div<{
  margin: React.CSSProperties["margin"];
}>`
  position: absolute;
  top: 0.1cm;
  margin: ${(props) => props.margin};
  width: calc(100% - 2 * ${(props) => props.margin});
  height: calc(100% - 2 * ${(props) => props.margin});
  box-sizing: content-box;
`;

const FullPage = styled.div<{
  background: React.CSSProperties["background"];
}>`
  display: flex;
  position: absolute;
  width: 100%;
  height: 100%;
  background: ${(props) => props.background};
  justify-content: center;
  align-items: center;
  z-index: 1;
`;
