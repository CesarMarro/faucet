-- Create faucet_requests table for tracking ETH requests
CREATE TABLE IF NOT EXISTS faucet_requests (
  id SERIAL PRIMARY KEY,
  address TEXT NOT NULL,
  tx_hash TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on address for faster lookups
CREATE INDEX IF NOT EXISTS idx_faucet_requests_address ON faucet_requests(address);

-- Create index on timestamp for 24h queries
CREATE INDEX IF NOT EXISTS idx_faucet_requests_timestamp ON faucet_requests(timestamp);
