import React, { useContext, useState } from 'react';
import { View, Dimensions, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Svg, G, Path, Text as SvgText } from 'react-native-svg';
import * as d3Shape from 'd3-shape';
import {
  CategoryDataContext,
  ExpenseDataContext,
  TagDataContext,
  TypeDataContext,
} from '@/constants/Context';
import { DataType, Tag, Type, Category } from '@/constants/Types';
import { Colors } from '@/constants/Colors';

interface ChartData {
  name: string;
  value: number;
  color: string;
  children?: ChartData[];
}

const { width } = Dimensions.get('window');
const size = width - 50;
const innerRadius = size / 4;
const outerRadius = size / 2;

const DonutChart: React.FC = () => {
  const { data } = useContext(ExpenseDataContext);
  const { category: categories } = useContext(CategoryDataContext);
  const { tags } = useContext(TagDataContext);
  const { types } = useContext(TypeDataContext);

  const [selectedCategory, setSelectedCategory] = useState<ChartData | null>(null);

  // Process and structure data into hierarchical format
  const chartData = processData(data || [], categories || [], tags || [], types || []);

  const handleBack = () => setSelectedCategory(null);

  const arcs = createArcs(chartData, selectedCategory, setSelectedCategory);

  // Conditionally show tags or categories in the legend
  const legendData = selectedCategory ? selectedCategory.children || [] : chartData;

  return (
    <View style={styles.container}>
      {selectedCategory && (
        <TouchableOpacity onPress={handleBack}>
          <Text style={styles.backButton}>Back to Full Chart</Text>
        </TouchableOpacity>
      )}
      <View style={styles.chartContainer}>
        <Svg width={size} height={size}>
          <G x={size / 2} y={size / 2}>
            {arcs}
          </G>
        </Svg>
      </View>
      <View style={styles.legendContainer}>
        {legendData.map((item, index) => (
          <View style={styles.legendItem} key={index}>
            <View style={[styles.legendColor, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>{item.name}</Text>
            <Text style={styles.legendAmount}>{item.value.toFixed(2)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// Helper function to process data
const processData = (
  expenseData: DataType[],
  categories: Category[],
  tags: Tag[],
  types: Type[]
): ChartData[] => {
  const expenseType = types.find((t) => t.type_name.toLowerCase() === 'expense');
  const filteredExpenseData = expenseData.filter((entry) => entry.type_id === expenseType?.id);

  const chartData: ChartData[] = categories
    .map((category) => {
      const categoryTags = tags.filter((tag) => tag.category_id === category.id);

      const tagData = categoryTags
        .map((tag) => {
          const amount = filteredExpenseData
            .filter((entry) => entry.tag_id === tag.id)
            .reduce((sum, entry) => sum + entry.amount, 0);

          return {
            name: tag.tag_name,
            value: Math.round(amount * 100) / 100,
            color: generateColor(tag.tag_name),
          };
        })
        .filter((tag) => tag.value > 0);

      const categoryAmount = tagData.reduce((sum, tag) => sum + tag.value, 0);

      return {
        name: category.category_name,
        value: Math.round(categoryAmount * 100) / 100,
        color: generateColor(category.category_name),
        children: tagData,
      };
    })
    .filter((category) => category.value > 0);

  return chartData;
};

// Helper function to create arcs
const createArcs = (
  data: ChartData[],
  selectedCategory: ChartData | null,
  setSelectedCategory: React.Dispatch<React.SetStateAction<ChartData | null>>
) => {
  const chartData = selectedCategory ? selectedCategory.children || [] : data;

  const pie = d3Shape.pie<ChartData>().value((d) => d.value).sort(null);
  const slices = pie(chartData);

  const arcGenerator = d3Shape
    .arc<d3Shape.PieArcDatum<ChartData>>()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
    .cornerRadius(0);

  return slices.map((slice, index) => {
    const path = arcGenerator(slice);

    return (
      <G key={`slice-${index}`}>
        <Path
          d={path!}
          fill={slice.data.color}
          onPress={() => {
            if (!selectedCategory) {
              setSelectedCategory(slice.data);
            }
          }}
        />
        <SvgText
          x={arcGenerator.centroid(slice)[0]}
          y={arcGenerator.centroid(slice)[1]}
          textAnchor="middle"
          fontSize={14}
          fill="white"
        >
          {slice.data.name}
        </SvgText>
      </G>
    );
  });
};

// Color generator helper function
const generateColor = (name: string): string => {
  const hash = Array.from(name).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 60%)`;
};

// Styles
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    fontSize: 16,
    marginBottom: 10,
    color: Colors.dark.text,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 20,
    width: size,
    height: size,
  },
  legendContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
    width: '50%',
    marginBottom: 10,
  },
  legendColor: {
    width: 16,
    height: 16,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: Colors.dark.text,
    flex: 1,
  },
  legendAmount: {
    fontSize: 14,
    color: Colors.dark.text,
    textAlign: 'right',
  },
});

export default DonutChart;
