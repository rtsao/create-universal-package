module.exports = function logger(jobs) {
  console.log('CI logger working...');
  for (let job of jobs) {
    console.log(job.pending);
    job.worker.then(
      () => {
        console.log(job.success);
      },
      () => {
        console.log(job.failure);
      },
    );
  }
};
