import aiohttp

DATABASE_LINK = "https://superaitutor.vercel.app/api/db"
# DATABASE_LINK = "http://127.0.0.1:6100/api/db"

async def read(DATABASE_ID):
    url = DATABASE_LINK
    payload = {
        "id": "@IEM01",
        "task": "read"
    }
    headers = {
        "Content-Type": "application/json"
    }

    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=payload, headers=headers) as response:
                response.raise_for_status()
                data = await response.json()
                if(len(data) >= 1):
                    return data
    except Exception as err:
        print("Error fetching data:", err)


async def write(DATABSE_ID, entries):
    url = DATABASE_LINK
    payload = {
        "id": DATABSE_ID,
        "task": "write",
        "entries": entries
    }
    headers = {
        "Content-Type": "application/json"
    }

    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=payload, headers=headers) as response:
                if response.status != 200:
                    raise Exception(f"Server error: {response.status}")
                data = await response.json()
                print("Response from backend:", data)
                return data
    except Exception as error:
        print("Error writing data:", error)
        return None
