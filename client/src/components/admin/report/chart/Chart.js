import React from 'react';
import { Bar } from 'react-chartjs-2';

const Chart = props => {
  return (
    <div className="chart">
      <Bar
        data={props.chartData}
        options={{
          title: {
            display: props.displayTitle,
            text:    props.textTitle,
            fontSize: 25
          },
           legend: {
            display: props.displayLegend,
            position: props.legendPosition
          },
          scales: {
            xAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'Vacations with followers'
                }              
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    stepSize: 1
                },
                scaleLabel: {
                  display: true,
                  labelString: 'Number of Followers'
                }              
            }]
          },
          responsive: true,
          maintainAspectRatio: true
        }}          
      />      
    </div>
  )
};

Chart.defaultProps = {
  displayTitle: true,
  displayLegend: true,
  legendPosition: 'bottom',
  textTitle: 'Number of Vacation Followers',
}

export default Chart;

