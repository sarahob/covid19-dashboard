(async () => {
  const geoRes = await fetch('./geo.json');

  const covidRes = await fetch('https://api.covid19api.com/summary');

  const covidData = await covidRes.json();

  const geoData = await geoRes.json();

  const margin = { top: 20, right: 100, bottom: 20, left: 100 },
    width = 1200 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

  const color = d3
    .scaleQuantile()
    .domain([0, 100, 500, 1000, 1500, 5000, 10000, 500000, 1000000])
    .range(d3.schemeBlues[9]);

  const mapGroup = d3
    .select('div.chart-container')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('class', 'map');

  const projection = d3
    .geoMercator()
    .scale(130)
    .translate([width / 2, height / 1.5]);

  const path = d3.geoPath().projection(projection);

  mapGroup
    .append('g')
    .attr('class', 'countries')
    .selectAll('path')
    .data(geoData.features)
    .enter()
    .append('path')
    .attr('d', path);

  mapGroup
    .selectAll('path')
    .attr('stroke', '#343534')
    .attr('stroke-opacity', 0.6)
    .attr('fill', (d) => {
      const countryData = covidData.Countries.filter(
        (f) => f.CountryCode === d.properties.iso_a2
      )[0];
      return countryData ? color(countryData.TotalConfirmed) : color(0);
    });

  const { TotalConfirmed, TotalDeaths, TotalRecovered } = covidData.Global;

  const totalCases = d3
    .select('div.total.cases')
    .append('svg')
    .datum(TotalConfirmed)
    .append('text');

  totalCases
    .style('transform', 'translate(25%, 50%)')
    .style('font-family', 'monospace')
    .style('font-size', '50px')
    .style('fill', '#08519C')
    .text(0);

  totalCases
    .transition()
    .duration(2000)
    .textTween((d) => {
      return d3.interpolate(0, d);
    });

  const totalDeaths = d3
    .select('div.total.deaths')
    .append('svg')
    .datum(TotalDeaths)
    .append('text');

  totalDeaths
    .style('transform', 'translate(25%, 50%)')
    .style('font-family', 'monospace')
    .style('font-size', '50px')
    .style('fill', '#08519C')
    .text(0);

  totalDeaths
    .transition()
    .duration(2000)
    .textTween((d) => {
      return d3.interpolate(0, d);
    });

  const totalRecovered = d3
    .select('div.total.recovered')
    .append('svg')
    .datum(TotalRecovered)
    .append('text');

  totalRecovered
    .style('transform', 'translate(25%, 50%)')
    .style('font-family', 'monospace')
    .style('font-size', '50px')
    .style('fill', '#08519C')
    .text(0);

  totalRecovered
    .transition()
    .duration(2000)
    .textTween((d) => {
      return d3.interpolate(0, d);
    });
})();
