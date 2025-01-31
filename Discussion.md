### **Discussion.md**

## Solutions Considered

### **1. Simple File Read and Filter Approach**
- **Description**:  
  The simplest approach involves reading the entire log file line by line, checking if each line contains the specified date, and writing matching entries to an output file.

- **Implementation**:  
  - Open the log file.
  - Read each line and check if the timestamp at the start matches the provided date.
  - If a match is found, write the line to the output file.

- **Pros**:  
  - Simple to implement.
  - No complex algorithms required.
  
- **Cons**:  
  - **Memory inefficient** for large files like 1 TB.
  - Requires iterating through the entire file, even though logs are distributed across multiple years, making it slow.
  - Performance degrades with increasing file size.



### **2. Multi-threaded Parallel File Processing (Using Node.js Streams)**
- **Description**:  
  This approach splits the large file into smaller chunks and processes them in parallel using multiple worker threads. The chunks are divided based on dates, and each thread processes a date range, reducing the time needed to read the log file.

- **Implementation**:  
  - Split the log file by date.
  - Use Node.js `worker_threads` or external libraries to process chunks in parallel.
  - Each worker processes a date range and writes matching entries to the output file.

- **Pros**:  
  - Faster due to parallel processing.
  - Reduces the overall time for filtering logs.
  
- **Cons**:  
  - More complex to implement.
  - Thread management and file splitting add overhead.
  - Can be inefficient for small date ranges.



### **3. Using Node.js Readable Streams and Buffering**
- **Description**:  
  This approach uses Node.js streams to read the log file in chunks, processing the file in a non-blocking and memory-efficient way. We utilize the `readline` module to process each line in the stream and apply a filter to check if the date matches.

- **Implementation**:  
  - Use `fs.createReadStream` to create a stream from the log file.
  - Pipe the stream into a `readline` interface to process each line.
  - If the line starts with the specified date, write it to the output file.
  
- **Pros**:  
  - **Memory efficient**, processes the file in small chunks.
  - Utilizes Node.js’s **non-blocking I/O model** for better scalability.
  - Does not require the whole file to be loaded into memory.

- **Cons**:  
  - Still reads through the entire file line by line, though it is more efficient than loading the entire file.
  - Slightly slower than external tools like `grep`, but offers more flexibility and control for future enhancements.



### **4. Using External Tools (e.g., `grep` or `awk`)**
- **Description**:  
  An alternative solution would be to use external tools like `grep` (for Unix systems) to quickly filter out logs by date, invoked either from Node.js or directly in the terminal.

- **Implementation**:  
  - Use `grep` or `awk` to filter logs for a specific date.
  - Example:
    ```bash
    grep "^2024-12-01" test_logs.log > output/output_2024-12-01.txt
    ```

- **Pros**:  
  - **Fast** due to optimized native tools.
  - Easy to implement with minimal code.
  
- **Cons**:  
  - **Platform-specific** (works mainly on Unix-based systems).
  - Less portable, especially on Windows.
  - Does not provide fine-grained control over output handling like the Node.js solution.

---

## Final Solution Summary

The final solution chosen is based on **Node.js streams**. This approach is both **memory-efficient** and **scalable**, ensuring that the application can handle log files as large as 1 TB without significant performance degradation. It also provides flexibility for further expansion.

The reasons for selecting this approach include:
- **Memory Efficiency**: By using streams, only small chunks of the file are processed at a time, which prevents excessive memory usage.
- **Portability**: The solution works on any platform (Windows, macOS, Linux) without requiring external tools or complex configurations.
- **Simplicity**: The solution is straightforward to implement, while still providing good performance for large files and flexibility for future updates.

We eliminated the use of external tools like `grep` due to platform dependencies and lack of control over the output.



## Steps to Run

1. **Download the log file** (if not already downloaded):
   ```bash
   curl -L -o test_logs.log "https://limewire.com/d/90794bb3-6831-4e02-8a59-ffc7f3b8b2a3#X1xnzrH5s4H_DKEkT_dfBuUT1mFKZuj4cFWNoMJGX98"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the extraction script** with a specific date (e.g., `2024-12-01`):
   ```bash
   node src/extract_logs.js 2024-12-01
   ```

4. **Check the output**:
   - The output file will be saved in the `output/` directory as `output_YYYY-MM-DD.txt`.
   - You can view it by using:
     ```bash
     cat output/output_2024-12-01.txt
     ```

