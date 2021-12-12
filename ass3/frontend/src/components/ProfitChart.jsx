import React from 'react'
import { Bar } from 'react-chartjs-2';
import PropTypes from 'prop-types';

const ProfitChart = (props) => {
  const xAxis = [];
  const yAxis = [];
  for (let i = 0; i <= 30; i++) {
    xAxis.push(i);
    yAxis.push(0);
  }

  props.allBookings.forEach((booking, idx) => {
    if (props.listingIds.includes(booking.listingId) && booking.status === 'accepted') {
      const endDate = new Date(booking.dateRange.end);
      const now = Date.now();
      const timeDiff = now - endDate;
      const duration = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) - 1;
      yAxis[duration] += parseInt(booking.totalPrice);
    }
  });

  return (
      <div>
        <Bar
          data={{
            labels: xAxis,
            datasets: [
              {
                label: 'Profits made last month in $',
                data: yAxis,
                backgroundColor: ['#3242a8']
              }
            ]
          }}
          height={400}
          width={600}
          options={{
            maintainAspectRatio: false,
          }}
        />
      </div>

  )
}

ProfitChart.propTypes = {
  allBookings: PropTypes.array,
  listingIds: PropTypes.array,
}

export default ProfitChart
