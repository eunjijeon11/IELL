import {
  Box,
  Center,
  Container,
  Grid,
  GridItem,
  SimpleGrid
} from "@chakra-ui/react";
import { Group } from "@visx/group";
import { ScaleSVG } from "@visx/responsive";
import Text from "@visx/text/lib/Text";
import { schemeCategory10 as COLOR } from "d3-scale-chromatic";
import { useRecoilState } from "recoil";
import { AreaAxis, AreaMark } from "../components/AreaChart";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import InputBox from "../components/InputBox";
import { RadarAxis, RadarMark } from "../components/RadarChart";
import {
  AREA_HEIGHT,
  AREA_MARGIN,
  AREA_WIDTH,
  AVERAGE,
  RADAR_HEIGHT,
  RADAR_WIDTH,
  RADER_MARGIN,
  VALUE
} from "../config";
import { dataState, historyState } from "../recoil/index";
import { Attribute, getScores, History } from "../types";

const mean = (arr: number[]) => arr.reduce((a, b) => a + b) / arr.length;

function HistoryAreaChart(history: History, attribute: Attribute) {
  return (
    <Box>
      <ScaleSVG width={AREA_WIDTH} height={AREA_HEIGHT}>
        <Text
          textAnchor="middle"
          x={AREA_WIDTH / 2}
          y={3}
          fill="gray"
          verticalAnchor="start"
          fontWeight="bold"
        >
          {attribute[0].toUpperCase() + attribute.slice(1)}
        </Text>
        <AreaAxis
          width={AREA_WIDTH}
          height={AREA_HEIGHT}
          margin={AREA_MARGIN}
          data={
            attribute !== "overall score"
              ? history.map((d) => d[attribute])
              : history.map((d) => mean(getScores(d)))
          }
          color={COLOR[0]}
        />
        <AreaMark
          width={AREA_WIDTH}
          height={AREA_HEIGHT}
          margin={AREA_MARGIN}
          data={
            attribute !== "overall score"
              ? history.map((d) => d[attribute])
              : history.map((d) => mean(getScores(d)))
          }
          color={attribute !== "overall score" ? COLOR[0] : COLOR[1]}
        />
      </ScaleSVG>
    </Box>
  );
}

export default function Home() {
  const [data, setData] = useRecoilState(dataState);
  const [history, setHistory] = useRecoilState(historyState);

  return (
    <>
      <Container maxW="container.xl" pt="20" pb="5">
        <Grid
          templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }}
          gap={4}
        >
          <GridItem w={"full"}>
            <InputBox />
          </GridItem>
          <GridItem w={"full"}>
            <ScaleSVG width={RADAR_WIDTH} height={RADAR_HEIGHT}>
              <Group top={RADAR_HEIGHT / 2} left={RADAR_WIDTH / 2}>
                <RadarAxis
                  width={RADAR_WIDTH}
                  height={RADAR_HEIGHT}
                  margin={RADER_MARGIN}
                />
                <RadarMark
                  data={data}
                  color={COLOR[0]}
                  width={RADAR_WIDTH}
                  height={RADAR_HEIGHT}
                  margin={RADER_MARGIN}
                />
                <RadarMark
                  data={AVERAGE}
                  color={COLOR[7]}
                  width={RADAR_WIDTH}
                  height={RADAR_HEIGHT}
                  margin={RADER_MARGIN}
                />
                <Text
                  x="80"
                  y="90"
                  fontWeight="bold"
                  fontSize="8px"
                  fill="#7f7f7f"
                >
                  ■ Student Score
                </Text>
                <Text
                  x="80"
                  y="80"
                  fontSize="8px"
                  fontWeight="bold"
                  fill="#1f77b4"
                >
                  ■ My Score
                </Text>
              </Group>
            </ScaleSVG>
          </GridItem>
          <GridItem colSpan={{ base: 1, md: 2 }} w="full">
            <SimpleGrid
              w="full"
              minChildWidth={{ base: 150, md: 240 }}
              spacing={4}
            >
              {VALUE.map((v) => HistoryAreaChart(history, v))}
              <Center
                wordBreak={"keep-all"}
                bgColor={"gray.100"}
                m={5}
                borderRadius={10}
                p={5}
              >
                그래프를 클릭해
                <br /> 히스토리를 확인하세요!
              </Center>
            </SimpleGrid>
          </GridItem>
        </Grid>
      </Container>
      <Header />
      <Footer />
    </>
  );
}
