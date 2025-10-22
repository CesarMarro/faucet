import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { ethers } from 'npm:ethers@6';

interface FaucetRequest {
  address: string;
}

interface FaucetResponse {
  ok: boolean;
  txHash?: string;
  error?: string;
}

Deno.serve(async (req: Request): Promise<Response> => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, error: 'Method not allowed' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  try {
    // Parse request body
    const body: FaucetRequest = await req.json();
    const { address } = body;

    if (!address) {
      return new Response(JSON.stringify({ ok: false, error: 'Address is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Validate Ethereum address
    if (!ethers.isAddress(address)) {
      return new Response(JSON.stringify({ ok: false, error: 'Invalid Ethereum address' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if address has requested in the last 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    const { data: existingRequest, error: queryError } = await supabase
      .from('faucet_requests')
      .select('*')
      .eq('address', address)
      .gte('timestamp', twentyFourHoursAgo)
      .single();

    if (queryError && queryError.code !== 'PGRST116') {
      console.error('Database query error:', queryError);
      return new Response(JSON.stringify({ ok: false, error: 'Database error' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    if (existingRequest) {
      return new Response(JSON.stringify({ ok: false, error: 'Ya solicitaste en las últimas 24h' }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Get environment variables for blockchain interaction
    const infuraRpcUrl = Deno.env.get('INFURA_RPC_URL');
    const faucetPrivateKey = Deno.env.get('FAUCET_PRIVATE_KEY');

    if (!infuraRpcUrl || !faucetPrivateKey) {
      console.error('Missing environment variables: INFURA_RPC_URL or FAUCET_PRIVATE_KEY');
      return new Response(JSON.stringify({ ok: false, error: 'Server configuration error' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Create provider and wallet
    const provider = new ethers.JsonRpcProvider(infuraRpcUrl);
    const wallet = new ethers.Wallet(faucetPrivateKey, provider);

    // Check wallet balance
    const balance = await wallet.provider.getBalance(wallet.address);
    const ethAmount = ethers.parseEther('0.01');
    
    if (balance < ethAmount) {
      console.error('Insufficient faucet balance');
      return new Response(JSON.stringify({ ok: false, error: 'Faucet temporarily out of funds' }), {
        status: 503,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Send transaction
    const tx = await wallet.sendTransaction({
      to: address,
      value: ethAmount,
      gasLimit: 21000,
    });

    console.log(`Transaction sent: ${tx.hash}`);

    // Wait for transaction confirmation
    const receipt = await tx.wait();
    
    if (!receipt || receipt.status !== 1) {
      console.error('Transaction failed:', receipt);
      return new Response(JSON.stringify({ ok: false, error: 'Transaction failed' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Insert record into database
    const { error: insertError } = await supabase
      .from('faucet_requests')
      .insert({
        address: address,
        tx_hash: tx.hash,
      });

    if (insertError) {
      console.error('Database insert error:', insertError);
      // Transaction succeeded but we couldn't log it - still return success
    }

    return new Response(JSON.stringify({ ok: true, txHash: tx.hash }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Faucet error:', error);
    
    // Handle specific error types
    if (error.code === 'INSUFFICIENT_FUNDS') {
      return new Response(JSON.stringify({ ok: false, error: 'Faucet temporarily out of funds' }), {
        status: 503,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
    
    if (error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT') {
      return new Response(JSON.stringify({ ok: false, error: 'Network error, please try again' }), {
        status: 503,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    return new Response(JSON.stringify({ ok: false, error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
});
