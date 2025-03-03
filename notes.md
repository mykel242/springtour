## Setting up Mastodon OAuth 2.0

|           | Secrets!                                   |
|:-----------------:|:-------------------------------------------|
|Client key 	      | ZNiVVLOXY-qMkMbU1wQ2NsJ-BIhuegyiVnqU7fui69c|
|Client secret 	    | 1Ukb16uhhwRNgzfRfzUEuik1kuCojYPqbDXglSZ2ZVY|
|Your Access Token  | FwS2N874TYE-EOHpclCUDQYGu-QjiytLT7V2F7AvevQ|

```bash
    % curl -X POST "https://mastodon.social/api/v1/apps" \
        -F client_name="springtour" \
        -F redirect_uris="urn:ietf:wg:oauth:2.0:oob" \
        -F scopes="read" \
        -F website="http://dotpitch.xyz"
```
**result**:
```json
  { "id":"6887551",
    "name":"springtour",
    "website":"http://dotpitch.xyz",
    "scopes":["read"],
    "redirect_uris":["urn:ietf:wg:oauth:2.0:oob"],
    "vapid_key":"BCk-QqERU0q-CfYZjcuB6lnyyOYfJ2AifKqfeGIm7Z-HiTU5T9eTG5GxVA0_OH5mMlI4UkkDTpaZwozy0TzdZ2M=",
    "redirect_uri":"urn:ietf:wg:oauth:2.0:oob",
    "client_id":"9xTydVmp3TNFhF6vfKlGfyQFS8gJshp6_TjoDAZKZvw",
    "client_secret":"nFaO-vHXTnFFmMPnGkiSNBHEilq1nYb3Ch_K68IYs8k",
    "client_secret_expires_at":0
  }
```
