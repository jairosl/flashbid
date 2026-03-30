export const PLACE_BID_SCRIPT = `
local auctionKey = KEYS[1]
local bidKey = KEYS[2]
local userId = ARGV[1]
local amount = tonumber(ARGV[2])
local now = tonumber(ARGV[3])
local antiSnipeSeconds = 10

local auction = redis.call("GET", auctionKey)
if not auction then
	return cjson.encode({ err = "Auction not found" })
end

local auctionData = cjson.decode(auction)

-- Check if status is pending or active
if auctionData.status ~= "active" and auctionData.status ~= "pending" then
	return cjson.encode({ err = "Auction is not active" })
end

-- Check if auction has ended
if now > tonumber(auctionData.endTime) then
	return cjson.encode({ err = "Auction has ended" })
end

local currentBid = tonumber(auctionData.currentBid)
if amount <= currentBid then
	return cjson.encode({ err = "Bid amount must be greater than current bid of " .. currentBid })
end

-- Anti-sniper logic
local endTime = tonumber(auctionData.endTime)
local tenSecondsBeforeEnd = endTime - (antiSnipeSeconds * 1000)
if now > tenSecondsBeforeEnd then
	auctionData.endTime = endTime + (antiSnipeSeconds * 1000)
end

-- Update auction data
auctionData.currentBid = amount
auctionData.currentBidderId = userId
auctionData.lastBidTime = now
auctionData.status = "active"

-- Save auction
redis.call("SET", auctionKey, cjson.encode(auctionData))

-- Save bid
local bidData = {
	id = crypto.randomUUID(), -- Note: ensure crypto is available in Redis or generate ID in TS
	auctionId = auctionData.id,
	userId = userId,
	amount = amount,
	createdAt = now,
}
redis.call("SET", bidKey, cjson.encode(bidData))

-- Publish update
redis.call("PUBLISH", auctionKey, cjson.encode(auctionData))

return cjson.encode({ success = true, auction = auctionData, bid = bidData })
`;
