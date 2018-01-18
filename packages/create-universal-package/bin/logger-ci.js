module.exports = function logger(jobs) {
  for (let job of jobs) {
    console.log(job.pending);
    job.worker.then(
      () => {
        console.log(job.success);
      },
      () => {
        console.log(job.failure);
        process.exitCode = 1;
      },
    );
  }
};
