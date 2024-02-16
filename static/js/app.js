function buildMetadata(sample) {
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
    let metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    // Array.filter(item => item == something)
    let filteredMetadata = metadata.filter(item => item.id == sample)    
    // Use d3 to select the panel with id of `#sample-metadata`
    let PANEL = d3.select("#sample-metadata");
  
    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Access the zeroith element of the filtered metadata to get a list of dictionaries to iterate over. 
    let dictlist = filteredMetadata[0]
  
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    // loop through the dictlist.
    for (key in dictlist){
    
      console.log(dictlist[key])
      PANEL.append("p").text(`${key}: ${dictlist[key]}`)

    };

  })
}
  
function buildCharts(sample) {
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
    let samples = data.samples;
    let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];
  
    let otu_ids = result.otu_ids;
    let otu_labels = result.otu_labels;
    let sample_values = result.sample_values;
  
    // Build a Bubble Chart
    let bubbleLayout = {
      title: 'OTU ID vs Sample Values',
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Sample Values' },
      hovermode: 'closest',
      showlegend: false,
      height: 600,
      width: 1000
    };
      
    let bubbleData = [
      {x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: 'Earth'}}
    ];
  
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  
    let yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
      
    let barData = [
      {x: sample_values.slice(0,10).reverse(),
       y: yticks,
       text: otu_labels.reverse(),
       type: 'bar',
       orientation: 'h' }
    ];
  
    let barLayout = {
      title: 'Top 10 OTUs',
      xaxis: { title: 'Sample Values' },
      yaxis: { title: 'OTU ID' },
        
    };
  
    Plotly.newPlot("bar", barData, barLayout);
  });
}
  
function init() {
  // Grab a reference to the dropdown select element
  let selector = d3.select("#selDataset");
    
  // Use the list of sample names to populate the select options
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
    let sampleNames = data.names;
  
    for (let i = 0; i < sampleNames.length; i++){
      selector.append("option").text(sampleNames[i]).property("value",sampleNames[i]);
    };
  
    // Use the first sample from the list to build the initial plots
    let firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}
  
function optionChanged(mple) {
  // Fetch new data each time a new sample is selected
  buildCharts(mple);
  buildMetadata(mple);
}
  
// Initialize the dashboard
init();