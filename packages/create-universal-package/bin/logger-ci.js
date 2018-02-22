module.exports = function logger(jobs) {
  for (let job of jobs) {
    console.log(job.pending);
    job.worker.then(
      () => {
        console.log(job.success);
      },
      err => {
        console.log(job.failure);
        console.error(err);
        process.exitCode = 1;
      }
    );
  }
};
