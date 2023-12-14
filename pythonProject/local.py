import requests

res = requests.get("http://127.0.0.1:3000/api/snacks/1")
# res = requests.put("http://127.0.0.1:3000/api/snacks/1", json={"change": -1})
print(res.json())
