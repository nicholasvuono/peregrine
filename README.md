# Peregrine

Peregrine (a.ka. p8) is a simple, modern, and opinionated performance testing toolkit!

A Node.js library that simplifies the intricacies of performance testing web applications, giving teams the ability to test the frontend and backend simultaneously and effortlessly.

It is an opinionated tool because it assumes load testing needs to involve both frontend and backend tests to truly understand the end user expereince.

That being said, this is also a great tool for simple functional performance testing, allowing you to run performance tests that aren't just load tests.

The main features of this toolkit are as follows:
  - Run backend functional performance and load tests (REST and GraphQL support)
  - Run frontend functional performance tests
  - Run the above simultaneously to get the wholistic picture
  - Set SLAs and thresholds
  - Pass or fail tests based on the set SLAs 
  - Easily integrate into CI systems with Docker
  
Capture backend performance metrics:
  - Request Rate (throughput)
  - Error Percentage
  - Response Times (average, median, 90th %, 95th %, 99th %)
  - Test Duration
  - Total Request Count
  - Iterations
  - Iteration Rate (another throughput metric)

Capture frontend page load metrics like:
  - First Paint
  - First Contentful Paint
  - First Input Delay
  - Time to Minimally Interactive
  - Resource Bundle Timings and Sizes
  - Most Importantly: User Journey Steps
