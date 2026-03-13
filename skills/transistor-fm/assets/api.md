Title: Transistor API Reference

URL Source: https://developers.transistor.fm/

Markdown Content:
Transistor API Reference
===============

* [Introduction](https://developers.transistor.fm/#intro)
* [Authentication](https://developers.transistor.fm/#authentication)
* [Rate Limits](https://developers.transistor.fm/#ratelimits)
* [Endpoints](https://developers.transistor.fm/#endpoints)

 * [Root](https://developers.transistor.fm/#root)
 * [Analytics](https://developers.transistor.fm/#analytics)
 * [Episodes](https://developers.transistor.fm/#episodes)
 * [Shows](https://developers.transistor.fm/#shows)
 * [Subscribers](https://developers.transistor.fm/#subscribers)
 * [Webhooks](https://developers.transistor.fm/#webhooks)

* [Resources](https://developers.transistor.fm/#resources)

 * [User](https://developers.transistor.fm/#User)
 * [Show](https://developers.transistor.fm/#Show)
 * [Episode](https://developers.transistor.fm/#Episode)
 * [Subscriber](https://developers.transistor.fm/#Subscriber)
 * [ShowAnalytics](https://developers.transistor.fm/#ShowAnalytics)
 * [EpisodesAnalytics](https://developers.transistor.fm/#EpisodesAnalytics)
 * [EpisodeAnalytics](https://developers.transistor.fm/#EpisodeAnalytics)
 * [AudioUpload](https://developers.transistor.fm/#AudioUpload)
 * [Webhook](https://developers.transistor.fm/#Webhook)

[Transistor.fm](https://transistor.fm/)

[](https://developers.transistor.fm/)
Transistor API
==============

Need an account?[Sign Up](https://dashboard.transistor.fm/signup)

[Your Dashboard →](https://dashboard.transistor.fm/)

The Transistor API is built around the [JSON:API](https://jsonapi.org/) specification. Our API allows you to work with podcasts, episodes, private podcast subscribers, and analytics. Endpoints accept JSON or form-encoded request bodies, return JSON-encoded responses, and use standard HTTP response codes.

[](https://developers.transistor.fm/)
Authentication[](https://developers.transistor.fm/#authentication "Link to this section")
-----------------------------------------------------------------------------------------

The Transistor API uses API keys to authenticate all requests. Your API keys can be viewed and reset in the [Account Area](https://dashboard.transistor.fm/account) of your Transistor Dashboard. Each API request must include an HTTP header `x-api-key` with its value being your API key.

Authenticated requests grant you access to any podcast or episode you would have access to through the Dashboard, along with the same level of access depending on if you're an owner, an admin, or a regular team member of a podcast.

* * *

[](https://developers.transistor.fm/)
Rate Limits[](https://developers.transistor.fm/#ratelimits "Link to this section")
----------------------------------------------------------------------------------

API requests are rate-limited to 10 requests per 10 seconds. If this limit is exceeded, you will be receive a `429` HTTP error code, and access will be blocked for 10 seconds. After these 10 seconds, you are free to use the API again.

If you are continually hitting the rate-limit, please review your use of the API and always cache responses when possible. The Transistor API is not meant to be the main data source for website content. If this is what you're looking for, you may want to simply parse the XML from your RSS feed.

* * *

[](https://developers.transistor.fm/)
Endpoints[](https://developers.transistor.fm/#endpoints "Link to this section")
-------------------------------------------------------------------------------

Because our API conforms to the [JSON:API](https://jsonapi.org/) spec, each endpoint also accepts extra parameters that can be helpful in certain scenarios: **sparse fieldsets** and **including related resources**. We've included examples of these in some of our example requests and responses.

### Sparse fieldsets

Sometimes you may wish to only have a handful of a resource's fields be returned from an API request, instead of the entire resource. Let's say you want to retrieve an Episode but only return the title and media_url. In your request you can specify `fields[episode][]=title&fields[episode][]=media_url`.

### Including related resources

You can also return a resource's related resources in one single API request instead of multiuple requests. For example, you may want to retrieve an Episode, but also include its parent Show resource. In your request you can specify `include[]=show`. You can also combine this with sparse fieldsets to request an Episode's related Show, but only return the Show's title and RSS feed URL, for example. `include[]=show&fields[show][]=title&fields[show][]=feed_url`.

[](https://developers.transistor.fm/)
### Root[](https://developers.transistor.fm/#root "Link to this section")

[](https://developers.transistor.fm/)

Get authenticated user[](https://developers.transistor.fm/#get-v1 "Link to this endpoint")
------------------------------------------------------------------------------------------

Retrieve details of the user account that is authenticating to the API.

```
GET
      /v1
```

Parameters
----------

 None. 

Response
--------

A single [User resource](https://developers.transistor.fm/#User)

Example
-------

### Request

```
$ curl https://api.transistor.fm/v1 -G \
  -H "x-api-key: your_api_key"
```

### Response

```
$ {
  "data": {
    "id": "173455",
    "type": "user",
    "attributes": {
      "created_at": "2020-01-01 00:00:00 UTC",
      "image_url": null,
      "name": "Jimmy Podcaster",
      "time_zone": "UTC",
      "updated_at": "2020-06-01 00:00:00 UTC"
    }
  }
}
```

[](https://developers.transistor.fm/)
### Analytics[](https://developers.transistor.fm/#analytics "Link to this section")

[](https://developers.transistor.fm/)

Get show analytics[](https://developers.transistor.fm/#get-v1-analytics-id "Link to this endpoint")
---------------------------------------------------------------------------------------------------

Retrieve analytics of downloads per day for an entire podcast. Defaults to the last 14 days.

```
GET
      /v1/analytics/:id
```

Parameters
----------

| Field | Type | Details | Description |
| --- | --- | --- | --- |
| id Required | String | | Show ID or slug |
| start_date | String | | Optional starting date for analytics (dd-mm-yyyy). Required if using an ending date. |
| end_date | String | | Optional ending date for analytics (dd-mm-yyyy). Required if using a starting date. |

Response
--------

A single [ShowAnalytics resource](https://developers.transistor.fm/#ShowAnalytics)

Example
-------

### Request

```
$ curl https://api.transistor.fm/v1/analytics/132543 -G \
  -H "x-api-key: your_api_key" \
  -d start_date=01-01-2020 \
  -d end_date=31-12-2020 \
  -d "include[]=show" \
  -d "fields[show][]=title"
```

### Response

```
$ {
  "data": {
    "id": "the-caffeine-show",
    "type": "show_analytics",
    "attributes": {
      "downloads": [
        {
          "date": "24-02-2026",
          "downloads": 0
        },
        {
          "date": "25-02-2026",
          "downloads": 0
        },
        {
          "date": "26-02-2026",
          "downloads": 0
        },
        {
          "date": "27-02-2026",
          "downloads": 0
        },
        {
          "date": "28-02-2026",
          "downloads": 0
        },
        {
          "date": "01-03-2026",
          "downloads": 0
        },
        {
          "date": "02-03-2026",
          "downloads": 0
        },
        {
          "date": "03-03-2026",
          "downloads": 0
        },
        {
          "date": "04-03-2026",
          "downloads": 0
        },
        {
          "date": "05-03-2026",
          "downloads": 0
        },
        {
          "date": "06-03-2026",
          "downloads": 0
        },
        {
          "date": "07-03-2026",
          "downloads": 0
        },
        {
          "date": "08-03-2026",
          "downloads": 0
        },
        {
          "date": "09-03-2026",
          "downloads": 0
        }
      ],
      "start_date": "02-24-2026",
      "end_date": "03-09-2026"
    },
    "relationships": {
      "show": {
        "data": {
          "id": "132543",
          "type": "show"
        }
      }
    }
  },
  "included": [
    {
      "id": "132543",
      "type": "show",
      "attributes": {
        "title": "The Caffeine Show"
      },
      "relationships": {}
    }
  ]
}
```

[](https://developers.transistor.fm/)

Get all episode analytics[](https://developers.transistor.fm/#get-v1-analytics-id-episodes "Link to this endpoint")
-------------------------------------------------------------------------------------------------------------------

Retrieve analytics of downloads per day for all episodes of a podcast. Defaults to the last 7 days.

```
GET
      /v1/analytics/:id/episodes
```

Parameters
----------

| Field | Type | Details | Description |
| --- | --- | --- | --- |
| id Required | String | | Show ID or slug |
| start_date | String | | Optional starting date for analytics (dd-mm-yyyy). Required if using an ending date. |
| end_date | String | | Optional ending date for analytics (dd-mm-yyyy). Required if using a starting date. |

Response
--------

A single [EpisodesAnalytics resource](https://developers.transistor.fm/#EpisodesAnalytics)

Example
-------

### Request

```
$ curl https://api.transistor.fm/v1/analytics/132543/episodes -G \
  -H "x-api-key: your_api_key" \
  -d start_date=01-01-2021 \
  -d end_date=07-01-2021 \
  -d "include[]=show" \
  -d "fields[show][]=title"
```

### Response

```
$ {
  "data": {
    "id": "the-caffeine-show",
    "type": "episodes_analytics",
    "attributes": {
      "episodes": [
        {
          "id": 2,
          "title": "Episode Two",
          "published_at": "2026-03-01 19:30:36 UTC",
          "downloads": [
            {
              "date": "02-24-2026",
              "downloads": 0
            },
            {
              "date": "02-25-2026",
              "downloads": 0
            },
            {
              "date": "02-26-2026",
              "downloads": 0
            },
            {
              "date": "02-27-2026",
              "downloads": 0
            },
            {
              "date": "02-28-2026",
              "downloads": 0
            },
            {
              "date": "03-01-2026",
              "downloads": 0
            },
            {
              "date": "03-02-2026",
              "downloads": 0
            }
          ]
        },
        {
          "id": 1,
          "title": "Episode One",
          "published_at": "2026-02-27 19:30:36 UTC",
          "downloads": [
            {
              "date": "02-24-2026",
              "downloads": 0
            },
            {
              "date": "02-25-2026",
              "downloads": 0
            },
            {
              "date": "02-26-2026",
              "downloads": 0
            },
            {
              "date": "02-27-2026",
              "downloads": 0
            },
            {
              "date": "02-28-2026",
              "downloads": 0
            },
            {
              "date": "03-01-2026",
              "downloads": 0
            },
            {
              "date": "03-02-2026",
              "downloads": 0
            }
          ]
        }
      ],
      "start_date": "02-24-2026",
      "end_date": "03-02-2026"
    },
    "relationships": {
      "show": {
        "data": {
          "id": "132543",
          "type": "show"
        }
      }
    }
  },
  "included": [
    {
      "id": "132543",
      "type": "show",
      "attributes": {
        "title": "The Caffeine Show"
      },
      "relationships": {}
    }
  ]
}
```

[](https://developers.transistor.fm/)

Get single episode analytics[](https://developers.transistor.fm/#get-v1-analytics-episodes-id "Link to this endpoint")
----------------------------------------------------------------------------------------------------------------------

Retrieve analytics of downloads per day for a single episode. Defaults to the last 14 days.

```
GET
      /v1/analytics/episodes/:id
```

Parameters
----------

| Field | Type | Details | Description |
| --- | --- | --- | --- |
| id Required | String | | Episode ID or slug |
| start_date | String | | Optional starting date for analytics (dd-mm-yyyy). Required if using an ending date. |
| end_date | String | | Optional ending date for analytics (dd-mm-yyyy). Required if using a starting date. |

Response
--------

A single [EpisodeAnalytics resource](https://developers.transistor.fm/#EpisodeAnalytics)

Example
-------

### Request

```
$ curl https://api.transistor.fm/v1/analytics/episodes/3056098 -G \
  -H "x-api-key: your_api_key" \
  -d start_date=01-01-2020 \
  -d end_date=31-12-2020 \
  -d "include[]=episode" \
  -d "fields[episode][]=title"
```

### Response

```
$ {
  "data": {
    "id": "3056098",
    "type": "episode_analytics",
    "attributes": {
      "downloads": [
        {
          "date": "24-02-2026",
          "downloads": 0
        },
        {
          "date": "25-02-2026",
          "downloads": 0
        },
        {
          "date": "26-02-2026",
          "downloads": 0
        },
        {
          "date": "27-02-2026",
          "downloads": 0
        },
        {
          "date": "28-02-2026",
          "downloads": 0
        },
        {
          "date": "01-03-2026",
          "downloads": 0
        },
        {
          "date": "02-03-2026",
          "downloads": 0
        },
        {
          "date": "03-03-2026",
          "downloads": 0
        },
        {
          "date": "04-03-2026",
          "downloads": 0
        },
        {
          "date": "05-03-2026",
          "downloads": 0
        },
        {
          "date": "06-03-2026",
          "downloads": 0
        },
        {
          "date": "07-03-2026",
          "downloads": 0
        },
        {
          "date": "08-03-2026",
          "downloads": 0
        },
        {
          "date": "09-03-2026",
          "downloads": 0
        }
      ],
      "start_date": "02-24-2026",
      "end_date": "03-09-2026"
    },
    "relationships": {
      "episode": {
        "data": {
          "id": "3056098",
          "type": "episode"
        }
      }
    }
  },
  "included": [
    {
      "id": "3056098",
      "type": "episode",
      "attributes": {
        "title": "How To Roast Coffee"
      },
      "relationships": {}
    }
  ]
}
```

[](https://developers.transistor.fm/)
### Episodes[](https://developers.transistor.fm/#episodes "Link to this section")

[](https://developers.transistor.fm/)

Get episodes[](https://developers.transistor.fm/#get-v1-episodes "Link to this endpoint")
-----------------------------------------------------------------------------------------

Retrieve a paginated list of episodes ordered by published date.

```
GET
      /v1/episodes
```

Parameters
----------

| Field | Type | Details | Description |
| --- | --- | --- | --- |
| show_id | String | | Show ID or slug |
| query | String | | Search query |
| status | String | One of | Publishing status: published, scheduled, or draft |
| order | String | One of Default: desc | Return order of episodes. Newest first (desc), or oldest first (asc) |
| pagination[page] | Integer | Default: 0 | Page number |
| pagination[per] | Integer | Default: 10 | Resources per page |

Response
--------

An array of [Episode resources](https://developers.transistor.fm/#Episode)

Example
-------

### Request

```
$ curl https://api.transistor.fm/v1/episodes -G \
  -H "x-api-key: your_api_key" \
  -d show_id=132543 \
  -d "pagination[page]=1" \
  -d "pagination[per]=5" \
  -d "fields[episode][]=title" \
  -d "fields[episode][]=published_at"
```

### Response

```
$ {
  "data": [
    {
      "id": "3056098",
      "type": "episode",
      "attributes": {
        "title": "How To Roast Coffee",
        "published_at": "2020-07-01 00:00:00 UTC"
      },
      "relationships": {}
    },
    {
      "id": "3056099",
      "type": "episode",
      "attributes": {
        "title": "The Effects of Caffeine",
        "published_at": "2020-07-01 00:00:00 UTC"
      },
      "relationships": {}
    }
  ],
  "meta": {
    "currentPage": 1,
    "totalPages": 1,
    "totalCount": 2
  }
}
```

[](https://developers.transistor.fm/)

Get an episode[](https://developers.transistor.fm/#get-v1-episodes-id "Link to this endpoint")
----------------------------------------------------------------------------------------------

Retrieve a single podcast episode.

```
GET
      /v1/episodes/:id
```

Parameters
----------

| Field | Type | Details | Description |
| --- | --- | --- | --- |
| id Required | String | | Episode ID |

Response
--------

A single [Episode resource](https://developers.transistor.fm/#Episode)

Example
-------

### Request

```
$ curl https://api.transistor.fm/v1/episodes/3056098 -G \
  -H "x-api-key: your_api_key" \
  -d "include[]=show" \
  -d "fields[show][]=title" \
  -d "fields[show][]=summary"
```

### Response

```
$ {
  "data": {
    "id": "3056098",
    "type": "episode",
    "attributes": {
      "title": "How To Roast Coffee",
      "number": 1,
      "season": 1,
      "status": "published",
      "published_at": "2020-07-01 00:00:00 UTC",
      "duration": 568,
      "explicit": false,
      "keywords": "coffee,caffeine,beans",
      "alternate_url": null,
      "media_url": "https://media.transistor.fm/5e08448f/c5873ac2.mp3",
      "image_url": null,
      "video_url": "https://www.youtube.com/watch?v=xcyHT1ZLd9Y",
      "author": "Jimmy Podcaster",
      "summary": "A primer on roasting coffee",
      "description": "This podcast talks about some <strong>strong</strong> coffee!",
      "slug": null,
      "created_at": "2020-03-01 00:00:00 UTC",
      "updated_at": "2020-03-01 00:00:00 UTC",
      "formatted_published_at": "July 1, 2020",
      "duration_in_mmss": "09:28",
      "share_url": "https://share.transistor.fm/s/5e08448f",
      "transcript_url": null,
      "transcripts": [],
      "formatted_summary": "A primer on roasting coffee",
      "formatted_description": "This podcast talks about some <strong>strong</strong> coffee!",
      "embed_html": "<iframe width=\"100%\" height=\"180\" frameborder=\"no\" scrolling=\"no\" seamless src=\"https://share.transistor.fm/e/5e08448f\"></iframe>",
      "embed_html_dark": "<iframe width=\"100%\" height=\"180\" frameborder=\"no\" scrolling=\"no\" seamless src=\"https://share.transistor.fm/e/5e08448f/dark\"></iframe>",
      "audio_processing": false,
      "type": "full",
      "email_notifications": null
    },
    "relationships": {
      "show": {
        "data": {
          "id": "132543",
          "type": "show"
        }
      }
    }
  },
  "included": [
    {
      "id": "132543",
      "type": "show",
      "attributes": {
        "title": "The Caffeine Show"
      },
      "relationships": {}
    }
  ]
}
```

[](https://developers.transistor.fm/)

Authorize an episode audio upload[](https://developers.transistor.fm/#get-v1-episodes-authorize_upload "Link to this endpoint")
-------------------------------------------------------------------------------------------------------------------------------

Authorize a URL for uploading a local audio file to be used when creating or updating an episode. If you already have a publicly available URL for your audio file, skip this step and use that URL in the `episode[audio_url]` field when creating or updating an episode.

```
GET
      /v1/episodes/authorize_upload
```

Parameters
----------

| Field | Type | Details | Description |
| --- | --- | --- | --- |
| filename Required | String | | Filename of the audio file you wish to upload |

Response
--------

A single [AudioUpload resource](https://developers.transistor.fm/#AudioUpload)

Example
-------

### Request

```
$ curl https://api.transistor.fm/v1/episodes/authorize_upload -G \
  -H "x-api-key: your_api_key" \
  -d filename=Episode1.mp3
```

### Response

```
$ {
  "data": {
    "id": "9c3a257c-f50e-4252-bea3-86e85d38d647",
    "type": "audio_upload",
    "attributes": {
      "upload_url": "https://transistorupload.s3.amazonaws.com/588ea179cb09e23eaf331d12f600ab9e.mp3?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJNPH...%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240402T175744Z&X-Amz-Expires=600&X-Amz-SignedHeaders=host&X-Amz-Signature=0c3bf1...",
      "content_type": "audio/mpeg",
      "expires_in": 600,
      "audio_url": "https://transistorupload.s3.amazonaws.com/588ea179cb09e23eaf331d12f600ab9e.mp3"
    }
  }
}
```

Uploading an Audio File using an upload_url and content_type
------------------------------------------------------------

Upload your audio file however you wish but it must be a PUT method HTTP request with the `content_type` of the audio file included as a header. After a successful 200 response, you may then use the `audio_url` as the `episode[audio_url]` when creating or updating an episode.

### CURL Example

```
$ curl -v -X PUT \
  -H "Content-Type: audio/mpeg" \
  -T /path/to/your/audio/Episode1.mp3 \
  "upload_url_from_authorize_upload"
```

### Ruby Example

```
require "net/http"

file = "/path/to/your/audio/Episode1.mp3"
presigned_url = "upload_url_from_authorize_upload"
url = URI.parse(presigned_url)

Net::HTTP.start(url.host) do |http|
  http.send_request("PUT", url.request_uri, File.read(file), { "content-type" => "audio/mpeg" })
end
```

[](https://developers.transistor.fm/)

Create an episode[](https://developers.transistor.fm/#post-v1-episodes "Link to this endpoint")
-----------------------------------------------------------------------------------------------

Create a new draft episode for the specified show. Note that publishing an episode involves a separate endpoint.

```
POST
      /v1/episodes
```

Parameters
----------

| Field | Type | Details | Description |
| --- | --- | --- | --- |
| episode[show_id] Required | String | | ID or Slug of the Show to add an episode to |
| episode[audio_url] | String | | URL to an episode's new audio file |
| episode[transcript_text] | String | | Full text of the episode transcript |
| episode[author] | String | | Episode author |
| episode[description] | String | | Longer episode description which may contain HTML and unformatted tags for chapters, people, supporters, etc |
| episode[explicit] | Boolean | | Episode contains explicit content |
| episode[image_url] | String | | Episode artwork image URL |
| episode[keywords] | String | | Comma-separated list of keywords |
| episode[number] | Integer | | Episode number |
| episode[season] | Integer | | Season number |
| episode[summary] | String | | Episode summary short description |
| episode[type] | String | One of | Full, trailer, or bonus episode |
| episode[title] | String | | Episode title |
| episode[alternate_url] | String | | Alternate episode URL overriding the share_url |
| episode[video_url] | String | | YouTube video URL to be embedded on episode sharing pages and website pages |
| episode[email_notifications] | Boolean | | Private podcast email notifications override (defaults to Show setting) |
| episode[increment_number] | Boolean | | Automatically set the number to the next episode number of the current season |

Response
--------

A single [Episode resource](https://developers.transistor.fm/#Episode)

Example
-------

### Request

```
$ curl https://api.transistor.fm/v1/episodes -X POST \
  -H "x-api-key: your_api_key" \
  -d "episode[show_id]=132543" \
  -d "episode[title]=Awesome podcast" \
  -d "episode[summary]=A podcast about awesome things" \
  -d "episode[season]=2" \
  -d "episode[number]=1"
```

### Response

```
$ {
  "data": {
    "id": "3056098",
    "type": "episode",
    "attributes": {
      "title": "Awesome podcast",
      "number": 1,
      "season": 2,
      "status": "draft",
      "published_at": null,
      "duration": null,
      "explicit": false,
      "keywords": null,
      "alternate_url": null,
      "media_url": "https://media.transistor.fm/c9763d66/fa0f928a.mp3",
      "image_url": null,
      "video_url": null,
      "author": null,
      "summary": "A podcast about awesome things",
      "description": null,
      "slug": null,
      "created_at": "2026-03-09 19:30:36 UTC",
      "updated_at": "2026-03-09 19:30:36 UTC",
      "formatted_published_at": null,
      "duration_in_mmss": "00:00",
      "share_url": "https://share.transistor.fm/s/c9763d66",
      "transcript_url": null,
      "transcripts": [],
      "formatted_summary": "A podcast about awesome things",
      "formatted_description": "",
      "embed_html": "<iframe width=\"100%\" height=\"180\" frameborder=\"no\" scrolling=\"no\" seamless src=\"https://share.transistor.fm/e/c9763d66\"></iframe>",
      "embed_html_dark": "<iframe width=\"100%\" height=\"180\" frameborder=\"no\" scrolling=\"no\" seamless src=\"https://share.transistor.fm/e/c9763d66/dark\"></iframe>",
      "audio_processing": false,
      "type": "full",
      "email_notifications": null
    },
    "relationships": {
      "show": {
        "data": {
          "id": "132543",
          "type": "show"
        }
      }
    }
  }
}
```

[](https://developers.transistor.fm/)

Update an episode[](https://developers.transistor.fm/#patch-v1-episodes-id "Link to this endpoint")
---------------------------------------------------------------------------------------------------

Update a single podcast episode. Note that publishing or unpublishing an episode involves a separate endpoint.

```
PATCH
      /v1/episodes/:id
```

Parameters
----------

| Field | Type | Details | Description |
| --- | --- | --- | --- |
| id Required | String | | Episode ID |
| episode[audio_url] | String | | URL to an episode's new audio file |
| episode[transcript_text] | String | | Full text of the episode transcript |
| episode[author] | String | | Episode author |
| episode[description] | String | | Longer episode description which may contain HTML and unformatted tags for chapters, people, supporters, etc |
| episode[explicit] | Boolean | | Episode contains explicit content |
| episode[image_url] | String | | Episode artwork image URL |
| episode[keywords] | String | | Comma-separated list of keywords |
| episode[number] | Integer | | Episode number |
| episode[season] | Integer | | Season number |
| episode[summary] | String | | Episode summary short description |
| episode[type] | String | One of | Full, trailer, or bonus episode |
| episode[title] | String | | Episode title |
| episode[alternate_url] | String | | Alternate episode URL overriding the share_url |
| episode[video_url] | String | | YouTube video URL to be embedded on episode sharing pages and website pages |
| episode[email_notifications] | Boolean | | Private podcast email notifications override (defaults to Show setting) |

Response
--------

A single [Episode resource](https://developers.transistor.fm/#Episode)

Example
-------

### Request

```
$ curl https://api.transistor.fm/v1/episodes/3056098 -X PATCH \
  -H "x-api-key: your_api_key" \
  -d "episode[title]=Updated podcast" \
  -d "fields[episode][]=title"
```

### Response

```
$ {
  "data": {
    "id": "3056098",
    "type": "episode",
    "attributes": {
      "title": "Updated podcast"
    },
    "relationships": {}
  }
}
```

[](https://developers.transistor.fm/)

Publish, schedule, or unpublish an episode[](https://developers.transistor.fm/#patch-v1-episodes-id-publish "Link to this endpoint")
------------------------------------------------------------------------------------------------------------------------------------

Publish a single episode now or in the past, schedule for the future, or revert to a draft.

```
PATCH
      /v1/episodes/:id/publish
```

Parameters
----------

| Field | Type | Details | Description |
| --- | --- | --- | --- |
| id Required | String | | Episode ID |
| episode[status] Required | String | One of | Publishing status: published, scheduled, or draft |
| episode[published_at] | String | | Episode publishing date and time - in your podcast's time zone |

Response
--------

A single [Episode resource](https://developers.transistor.fm/#Episode)

Example
-------

### Request

```
$ curl https://api.transistor.fm/v1/episodes/3056098/publish -X PATCH \
  -H "x-api-key: your_api_key" \
  -d "episode[status]=published" \
  -d "fields[episode][]=status"
```

### Response

```
$ {
  "data": {
    "id": "3056098",
    "type": "episode",
    "attributes": {
      "status": "published"
    },
    "relationships": {}
  }
}
```

[](https://developers.transistor.fm/)
### Shows[](https://developers.transistor.fm/#shows "Link to this section")

[](https://developers.transistor.fm/)

Get shows[](https://developers.transistor.fm/#get-v1-shows "Link to this endpoint")
-----------------------------------------------------------------------------------

Retrieve a paginated list of shows in descending order by updated date.

```
GET
      /v1/shows
```

Parameters
----------

| Field | Type | Details | Description |
| --- | --- | --- | --- |
| private | Boolean | | Filter for private shows |
| query | String | | Search query |
| pagination[page] | Integer | Default: 0 | Page number |
| pagination[per] | Integer | Default: 10 | Resources per page |

Response
--------

An array of [Show resources](https://developers.transistor.fm/#Show)

Example
-------

### Request

```
$ curl https://api.transistor.fm/v1/shows -G \
  -H "x-api-key: your_api_key" \
  -d "pagination[page]=1" \
  -d "pagination[per]=5" \
  -d "fields[show][]=title" \
  -d "fields[show][]=description"
```

### Response

```
$ {
  "data": [
    {
      "id": "132543",
      "type": "show",
      "attributes": {
        "title": "The Caffeine Show",
        "description": "A podcast covering all things coffee and caffeine"
      },
      "relationships": {}
    }
  ],
  "meta": {
    "currentPage": 1,
    "totalPages": 1,
    "totalCount": 1
  }
}
```

[](https://developers.transistor.fm/)

Get a show[](https://developers.transistor.fm/#get-v1-shows-id "Link to this endpoint")
---------------------------------------------------------------------------------------

Retrive a single show (podcast).

```
GET
      /v1/shows/:id
```

Parameters
----------

| Field | Type | Details | Description |
| --- | --- | --- | --- |
| id Required | String | | Show ID or slug |

Response
--------

A single [Show resource](https://developers.transistor.fm/#Show)

Example
-------

### Request

```
$ curl https://api.transistor.fm/v1/shows/132543 -G \
  -H "x-api-key: your_api_key"
```

### Response

```
$ {
  "data": {
    "id": "132543",
    "type": "show",
    "attributes": {
      "author": null,
      "category": "Arts :: Food",
      "copyright": null,
      "created_at": "2020-02-01 00:00:00 UTC",
      "description": "A podcast covering all things coffee and caffeine",
      "explicit": false,
      "image_url": null,
      "keywords": "coffee,caffeine,beans",
      "language": "en",
      "multiple_seasons": false,
      "owner_email": null,
      "playlist_limit": 25,
      "private": false,
      "secondary_category": "Arts",
      "show_type": "episodic",
      "slug": "the-caffeine-show",
      "time_zone": null,
      "title": "The Caffeine Show",
      "updated_at": "2020-06-01 00:00:00 UTC",
      "website": null,
      "feed_url": "https://feeds.transistor.fm/the-caffeine-show",
      "apple_podcasts": null,
      "amazon_music": null,
      "deezer": null,
      "spotify": null,
      "podcast_addict": null,
      "player_FM": null,
      "anghami": null,
      "castbox": null,
      "castro": null,
      "goodpods": null,
      "metacast": null,
      "iHeartRadio": null,
      "overcast": null,
      "pandora": null,
      "pocket_casts": null,
      "soundcloud": null,
      "tuneIn": null,
      "fountain": null,
      "jiosaavn": null,
      "gaana": null,
      "email_notifications": false
    },
    "relationships": {
      "episodes": {
        "data": []
      }
    }
  }
}
```

[](https://developers.transistor.fm/)

Update a show[](https://developers.transistor.fm/#patch-v1-shows-id "Link to this endpoint")
--------------------------------------------------------------------------------------------

Update a show with any or all of the following attributes.

```
PATCH
      /v1/shows/:id
```

Parameters
----------

| Field | Type | Details | Description |
| --- | --- | --- | --- |
| id Required | String | | Show ID or slug |
| show[author] | String | | Podcast author |
| show[category] | String | One of | Primary category |
| show[copyright] | String | | Copyright information |
| show[description] | String | | Podcast description |
| show[explicit] | Boolean | | Podcast contains explicit content |
| show[image_url] | String | | Podcast artwork image URL |
| show[keywords] | String | | Comma-separated list of keywords |
| show[language] | String | One of | Podcast's spoken language |
| show[owner_email] | String | | Podcast owner email |
| show[secondary_category] | String | One of | Secondary category |
| show[show_type] | String | One of | Publishing type. Episodic displays newest episodes, serial displays oldest first |
| show[title] | String | | Podcast title |
| show[time_zone] | String | One of | Publishing time zone |
| show[website] | String | | Podcast website |

Response
--------

A single [Show resource](https://developers.transistor.fm/#Show)

Example
-------

### Request

```
$ curl https://api.transistor.fm/v1/shows/132543 -X PATCH \
  -H "x-api-key: your_api_key" \
  -d "show[title]=Updated Title" \
  -d "show[author]=Updated Author" \
  -d "fields[show][]=title" \
  -d "fields[show][]=author"
```

### Response

```
$ {
  "data": {
    "id": "132543",
    "type": "show",
    "attributes": {
      "title": "Updated Title",
      "author": "Updated Author"
    },
    "relationships": {}
  }
}
```

[](https://developers.transistor.fm/)
### Subscribers[](https://developers.transistor.fm/#subscribers "Link to this section")

[](https://developers.transistor.fm/)

Get a list of subscribers[](https://developers.transistor.fm/#get-v1-subscribers "Link to this endpoint")
---------------------------------------------------------------------------------------------------------

Retrieve a list of all subscribers for a single private podcast.

```
GET
      /v1/subscribers
```

Parameters
----------

| Field | Type | Details | Description |
| --- | --- | --- | --- |
| show_id Required | String | | Show ID or slug |
| query | String | | Search query |
| pagination[page] | Integer | Default: 0 | Page number |
| pagination[per] | Integer | Default: 10 | Resources per page |

Response
--------

An array of [Subscriber resources](https://developers.transistor.fm/#Subscriber)

Example
-------

### Request

```
$ curl https://api.transistor.fm/v1/subscribers -G \
  -H "x-api-key: your_api_key" \
  -d show_id=132543 \
  -d "pagination[page]=1" \
  -d "pagination[per]=5" \
  -d "fields[subscriber][]=email"
```

### Response

```
$ {
  "data": [
    {
      "id": "709423",
      "type": "subscriber",
      "attributes": {
        "email": "arthur@example.com"
      },
      "relationships": {}
    },
    {
      "id": "709424",
      "type": "subscriber",
      "attributes": {
        "email": "beatrice@example.com"
      },
      "relationships": {}
    }
  ],
  "meta": {
    "currentPage": 1,
    "totalPages": 1,
    "totalCount": 2
  }
}
```

[](https://developers.transistor.fm/)

Retrieve a single private podcast subscriber.[](https://developers.transistor.fm/#get-v1-subscribers-id "Link to this endpoint")
--------------------------------------------------------------------------------------------------------------------------------

```
GET
      /v1/subscribers/:id
```

Parameters
----------

| Field | Type | Details | Description |
| --- | --- | --- | --- |
| id Required | String | | Subscriber ID |

Response
--------

A single [Subscriber resource](https://developers.transistor.fm/#Subscriber)

Example
-------

### Request

```
$ curl https://api.transistor.fm/v1/subscribers/709423 -G \
  -H "x-api-key: your_api_key"
```

### Response

```
$ {
  "data": {
    "id": "709423",
    "type": "subscriber",
    "attributes": {
      "email": "arthur@example.com",
      "status": "default",
      "feed_url": "https://subscribers.transistor.fm/b390b1089a13f0",
      "created_at": "2020-01-01 00:00:00 UTC",
      "updated_at": "2020-06-01 00:00:00 UTC",
      "last_notified_at": "2020-07-01 00:00:00 UTC",
      "has_downloads": false,
      "subscribe_url": "https://subscribe.transistor.fm/b390b1089a13f0"
    },
    "relationships": {
      "show": {
        "data": {
          "id": "132543",
          "type": "show"
        }
      }
    }
  }
}
```

[](https://developers.transistor.fm/)

Create a single subscriber[](https://developers.transistor.fm/#post-v1-subscribers "Link to this endpoint")
-----------------------------------------------------------------------------------------------------------

Add a single subscriber to a private podcast, and send an optional instructional email.

```
POST
      /v1/subscribers
```

Parameters
----------

| Field | Type | Details | Description |
| --- | --- | --- | --- |
| show_id Required | String | | Show ID or slug |
| email Required | String | | Email address |
| skip_welcome_email | Boolean | Default: false | Do not send the instructional email |

Response
--------

A single [Subscriber resource](https://developers.transistor.fm/#Subscriber)

Example
-------

### Request

```
$ curl https://api.transistor.fm/v1/subscribers -X POST \
  -H "x-api-key: your_api_key" \
  -d show_id=132543 \
  -d email=carol@example.com \
  -d "fields[subscriber][]=email"
```

### Response

```
$ {
  "data": {
    "id": "709427",
    "type": "subscriber",
    "attributes": {
      "email": "carol@example.com"
    },
    "relationships": {}
  }
}
```

[](https://developers.transistor.fm/)

Create multiple subscribers[](https://developers.transistor.fm/#post-v1-subscribers-batch "Link to this endpoint")
------------------------------------------------------------------------------------------------------------------

Add a batch of multiple subscribers to a private podcast, and send them optional instructional emails.

```
POST
      /v1/subscribers/batch
```

Parameters
----------

| Field | Type | Details | Description |
| --- | --- | --- | --- |
| show_id Required | String | | Show ID or slug |
| emails Required | [String] | | Array of email addresses |
| skip_welcome_email | Boolean | Default: false | Do not send the instructional emails |

Response
--------

An array of [Subscriber resources](https://developers.transistor.fm/#Subscriber)

Example
-------

### Request

```
$ curl https://api.transistor.fm/v1/subscribers/batch -X POST \
  -H "x-api-key: your_api_key" \
  -d show_id=132543 \
  -d "emails[]=carol@example.com" \
  -d "emails[]=derek@example.com" \
  -d "fields[subscriber][]=email"
```

### Response

```
$ {
  "data": [
    {
      "id": "709427",
      "type": "subscriber",
      "attributes": {
        "email": "carol@example.com"
      },
      "relationships": {}
    },
    {
      "id": "709428",
      "type": "subscriber",
      "attributes": {
        "email": "derek@example.com"
      },
      "relationships": {}
    }
  ]
}
```

[](https://developers.transistor.fm/)

Update a single subscriber[](https://developers.transistor.fm/#patch-v1-subscribers-id "Link to this endpoint")
---------------------------------------------------------------------------------------------------------------

Update a single private podcast subscriber.

```
PATCH
      /v1/subscribers/:id
```

Parameters
----------

| Field | Type | Details | Description |
| --- | --- | --- | --- |
| id Required | String | | Subscriber ID |
| subscriber[email] Required | String | | Subscriber's email address |

Response
--------

A single [Subscriber resource](https://developers.transistor.fm/#Subscriber)

Example
-------

### Request

```
$ curl https://api.transistor.fm/v1/subscribers/709423 -X PATCH \
  -H "x-api-key: your_api_key" \
  -d "subscriber[email]=updated@example.com" \
  -d "fields[subscriber][]=email"
```

### Response

```
$ {
  "data": {
    "id": "709423",
    "type": "subscriber",
    "attributes": {
      "email": "updated@example.com"
    },
    "relationships": {}
  }
}
```

[](https://developers.transistor.fm/)

Delete a single subscriber by email address[](https://developers.transistor.fm/#delete-v1-subscribers "Link to this endpoint")
------------------------------------------------------------------------------------------------------------------------------

Remove a single private podcast subscriber and revoke their access to the podcast.

```
DELETE
      /v1/subscribers
```

Parameters
----------

| Field | Type | Details | Description |
| --- | --- | --- | --- |
| show_id Required | String | | Show ID or slug |
| email Required | String | | Email address |

Response
--------

A single [Subscriber resource](https://developers.transistor.fm/#Subscriber)

Example
-------

### Request

```
$ curl https://api.transistor.fm/v1/subscribers -X DELETE \
  -H "x-api-key: your_api_key" \
  -d show_id=132543 \
  -d email=carol@example.com
```

### Response

```
$ {
  "data": {
    "id": "709423",
    "type": "subscriber",
    "attributes": {
      "email": "carol@example.com",
      "status": "default",
      "feed_url": "https://subscribers.transistor.fm/5a825ece727eb8",
      "created_at": "2020-01-01 00:00:00 UTC",
      "updated_at": "2020-06-01 00:00:00 UTC",
      "last_notified_at": "2020-07-01 00:00:00 UTC",
      "has_downloads": false,
      "subscribe_url": "https://subscribe.transistor.fm/5a825ece727eb8"
    },
    "relationships": {
      "show": {
        "data": {
          "id": "132543",
          "type": "show"
        }
      }
    }
  }
}
```

[](https://developers.transistor.fm/)

Delete a single subscriber by ID[](https://developers.transistor.fm/#delete-v1-subscribers-id "Link to this endpoint")
----------------------------------------------------------------------------------------------------------------------

Remove a single private podcast subscriber and revoke their access to the podcast.

```
DELETE
      /v1/subscribers/:id
```

Parameters
----------

| Field | Type | Details | Description |
| --- | --- | --- | --- |
| id Required | String | | Subscriber ID |

Response
--------

A single [Subscriber resource](https://developers.transistor.fm/#Subscriber)

Example
-------

### Request

```
$ curl https://api.transistor.fm/v1/subscribers/709423 -X DELETE \
  -H "x-api-key: your_api_key"
```

### Response

```
$ {
  "data": {
    "id": "709423",
    "type": "subscriber",
    "attributes": {
      "email": "arthur@example.com",
      "status": "default",
      "feed_url": "https://subscribers.transistor.fm/18629f95308d4f",
      "created_at": "2020-01-01 00:00:00 UTC",
      "updated_at": "2020-06-01 00:00:00 UTC",
      "last_notified_at": "2020-07-01 00:00:00 UTC",
      "has_downloads": false,
      "subscribe_url": "https://subscribe.transistor.fm/18629f95308d4f"
    },
    "relationships": {
      "show": {
        "data": {
          "id": "132543",
          "type": "show"
        }
      }
    }
  }
}
```

[](https://developers.transistor.fm/)
### Webhooks[](https://developers.transistor.fm/#webhooks "Link to this section")

[](https://developers.transistor.fm/)

Get webhooks[](https://developers.transistor.fm/#get-v1-webhooks "Link to this endpoint")
-----------------------------------------------------------------------------------------

Retrieve a list of webhooks for a show

```
GET
      /v1/webhooks
```

Parameters
----------

| Field | Type | Details | Description |
| --- | --- | --- | --- |
| show_id Required | String | | Show ID or slug |

Response
--------

An array of [Webhook resources](https://developers.transistor.fm/#Webhook)

Example
-------

### Request

```
$ curl https://api.transistor.fm/v1/webhooks -G \
  -H "x-api-key: your_api_key" \
  -d show_id=132543
```

### Response

```
$ {
  "data": [
    {
      "id": "104325",
      "type": "webhook",
      "attributes": {
        "event_name": "episode_created",
        "url": "http://example.com/incoming_web_hooks",
        "created_at": null,
        "updated_at": null
      },
      "relationships": {
        "user": {
          "data": {
            "id": "173455",
            "type": "user"
          }
        },
        "show": {
          "data": {
            "id": "132543",
            "type": "show"
          }
        }
      }
    }
  ]
}
```

[](https://developers.transistor.fm/)

Subscribe to webhook[](https://developers.transistor.fm/#post-v1-webhooks "Link to this endpoint")
--------------------------------------------------------------------------------------------------

Subscribe to a webhook with the given event name and show.

```
POST
      /v1/webhooks
```

Parameters
----------

| Field | Type | Details | Description |
| --- | --- | --- | --- |
| event_name Required | String | One of | Name of webhook event |
| show_id Required | String | | Show ID or slug |
| url Required | String | | Target URL for webhook delivery |

Response
--------

A single [Webhook resource](https://developers.transistor.fm/#Webhook)

Example
-------

### Request

```
$ curl https://api.transistor.fm/v1/webhooks -X POST \
  -H "x-api-key: your_api_key" \
  -d event_name=episode_created \
  -d show_id=1 \
  -d url=http://example.com/incoming_web_hooks
```

### Response

```
$ {
  "data": {
    "id": "104325",
    "type": "webhook",
    "attributes": {
      "event_name": "episode_created",
      "url": "http://example.com/incoming_web_hooks",
      "created_at": null,
      "updated_at": null
    },
    "relationships": {
      "user": {
        "data": {
          "id": "173455",
          "type": "user"
        }
      },
      "show": {
        "data": {
          "id": "132543",
          "type": "show"
        }
      }
    }
  }
}
```

[](https://developers.transistor.fm/)

Unsubscribe from webhook[](https://developers.transistor.fm/#delete-v1-webhooks-id "Link to this endpoint")
-----------------------------------------------------------------------------------------------------------

Unsubscribe from a webhook.

```
DELETE
      /v1/webhooks/:id
```

Parameters
----------

| Field | Type | Details | Description |
| --- | --- | --- | --- |
| id Required | String | | Webhook ID |

Response
--------

A single [Webhook resource](https://developers.transistor.fm/#Webhook)

Example
-------

### Request

```
$ curl https://api.transistor.fm/v1/webhooks/104325 -X DELETE \
  -H "x-api-key: your_api_key"
```

### Response

```
$ {
  "data": {
    "id": "104325",
    "type": "webhook",
    "attributes": {
      "event_name": "episode_created",
      "url": "http://example.com/incoming_web_hooks",
      "created_at": null,
      "updated_at": null
    },
    "relationships": {
      "user": {
        "data": {
          "id": "173455",
          "type": "user"
        }
      },
      "show": {
        "data": {
          "id": "132543",
          "type": "show"
        }
      }
    }
  }
}
```

* * *

[](https://developers.transistor.fm/)
Resources[](https://developers.transistor.fm/#resources "Link to this section")
-------------------------------------------------------------------------------

API Resources are data objects returned by successful API requests, representing Users, Shows, Episodes, Subscribers, Analytics, and Webhooks.

[](https://developers.transistor.fm/)
### User[](https://developers.transistor.fm/#User "Link to this resource")

The current Transistor user account authenticated for the API.

Fields
------

| Name | Type | Description |
| --- | --- | --- |
| created_at | Datetime | Timestamp of creation |
| image_url | String | Avatar image URL |
| name | String | Full name |
| time_zone | String | Current time zone |
| updated_at | Datetime | Timestamp of last update |

Relationships
-------------

 None. 

[](https://developers.transistor.fm/)
### Show[](https://developers.transistor.fm/#Show "Link to this resource")

An individual Transistor show (podcast).

Fields
------

| Name | Type | Description |
| --- | --- | --- |
| amazon_music | String | Amazon Music URL |
| anghami | String | Anghami URL |
| apple_podcasts | String | Apple Podcasts URL |
| author | String | Podcast author |
| castbox | String | Castbox URL |
| castro | String | Castro URL |
| category | String | Primary category |
| copyright | String | Copyright information |
| created_at | Datetime | Timestamp of creation |
| deezer | String | Deezer URL |
| description | String | Podcast description |
| email_notifications | Boolean | Private podcast email notifications enabled or disabled |
| explicit | Boolean | Podcast contains explicit content |
| feed_url | String | Podcast RSS Feed URL |
| fountain | String | Fountain URL |
| gaana | String | Gaana URL |
| goodpods | String | Goodpods URL |
| iHeartRadio | String | iHeartRadio URL |
| image_url | String | Podcast artwork image URL |
| jiosaavn | String | JioSaavn URL |
| keywords | String | Comma-separated list of keywords |
| language | String | Podcast's spoken language |
| metacast | String | Metacast URL |
| multiple_seasons | Boolean | Podcast has multiple seasons |
| overcast | String | Overcast URL |
| owner_email | String | Podcast owner email |
| pandora | String | Pandora URL |
| player_FM | String | Player FM URL |
| playlist_limit | Integer | Playlist embed player episode limit |
| pocket_casts | String | Pocket Casts URL |
| podcast_addict | String | Podcast Addict URL |
| private | Boolean | Podcast is private and subscribers are managed by admins |
| secondary_category | String | Secondary category |
| show_type | String | Publishing type. Episodic displays newest episodes, serial displays oldest first |
| slug | String | Podcast slug (used for API and RSS Feed URL) |
| soundcloud | String | Soundcloud URL |
| spotify | String | Spotify URL |
| time_zone | String | Publishing time zone |
| title | String | Podcast title |
| tuneIn | String | TuneIn URL |
| updated_at | Datetime | Timestamp of last update |
| website | String | Podcast website |

Relationships
-------------

| Name | Type |
| --- | --- |
| episodes | An array of [Episode resources](https://developers.transistor.fm/#Episode) |
| subscribers | An array of [Subscriber resources](https://developers.transistor.fm/#Subscriber) |

[](https://developers.transistor.fm/)
### Episode[](https://developers.transistor.fm/#Episode "Link to this resource")

An individual Transistor podcast episode record.

Fields
------

| Name | Type | Description |
| --- | --- | --- |
| alternate_url | String | Alternate episode URL overriding the share_url |
| audio_processing | Boolean | Denotes processing of audio after creating or updating the audio_url |
| author | String | Episode author |
| created_at | Datetime | Timestamp of creation |
| description | String | Longer episode description which may contain HTML and unformatted tags for chapters, people, supporters, etc |
| duration | Integer | Duration of episode in seconds |
| duration_in_mmss | String | Duration of episode in minutes and seconds. e.g. 34:12 |
| email_notifications | String | Private podcast email notifications override (defaults to Show setting) |
| embed_html | String | Embeddable audio player HTML |
| embed_html_dark | String | Dark theme of the embeddable audio player HTML |
| explicit | Boolean | Episode contains explicit content |
| formatted_description | String | HTML episode description including dynamic content like chapters, people, supporters, etc |
| formatted_published_at | String | Formatted version of the published_at datetime field |
| formatted_summary | String | Formatted episode summary short description |
| image_url | String | Episode artwork image URL |
| keywords | String | Comma-separated list of keywords |
| media_url | String | Trackable audio MP3 URL |
| number | Integer | Episode number |
| published_at | Datetime | Episode publishing date and time - in your podcast's time zone |
| season | Integer | Season number |
| share_url | String | Social media sharing page URL |
| slug | String | Slugified episode title used in Transistor websites. e.g. my-first-episode |
| status | String | Publishing status: published, scheduled, or draft |
| summary | String | Episode summary short description |
| title | String | Episode title |
| transcript_url | String | Shareable URL for the episode transcript |
| transcripts | Array | An array of URLs to AI transcription formats |
| type | String | Full, trailer, or bonus episode |
| updated_at | Datetime | Timestamp of last update |
| video_url | String | YouTube video URL to be embedded on episode sharing pages and website pages |

Relationships
-------------

| Name | Type |
| --- | --- |
| show | A single [Show resource](https://developers.transistor.fm/#Show) |

[](https://developers.transistor.fm/)
### Subscriber[](https://developers.transistor.fm/#Subscriber "Link to this resource")

An individual subscriber record for a private podcast.

Fields
------

| Name | Type | Description |
| --- | --- | --- |
| created_at | Datetime | Timestamp of creation |
| email | String | Subscriber's email address |
| feed_url | String | URL for subscriber's unique RSS Feed |
| has_downloads | Boolean | Subscriber has downloaded at least one episode |
| last_notified_at | Datetime | Timestamp of when subscriber was last emailed |
| status | String | Email notification status - default, subscribed, or unsubscribed |
| subscribe_url | String | URL for subscriber's private landing page |
| updated_at | Datetime | Timestamp of last update |

Relationships
-------------

| Name | Type |
| --- | --- |
| show | A single [Show resource](https://developers.transistor.fm/#Show) |

[](https://developers.transistor.fm/)
### ShowAnalytics[](https://developers.transistor.fm/#ShowAnalytics "Link to this resource")

Download analytics per day for a single podcast.

Fields
------

| Name | Type | Description |
| --- | --- | --- |
| downloads | Array | An array of download counts per day |
| end_date | String | Ending date of the analytics date range |
| start_date | String | Starting date of the analytics date range |

Relationships
-------------

| Name | Type |
| --- | --- |
| show | A single [Show resource](https://developers.transistor.fm/#Show) |

[](https://developers.transistor.fm/)
### EpisodesAnalytics[](https://developers.transistor.fm/#EpisodesAnalytics "Link to this resource")

Download analytics per day for all episodes of a single podcast.

Fields
------

| Name | Type | Description |
| --- | --- | --- |
| end_date | String | |
| episodes | Array | |
| start_date | String | |

Relationships
-------------

| Name | Type |
| --- | --- |
| show | A single [Show resource](https://developers.transistor.fm/#Show) |

[](https://developers.transistor.fm/)
### EpisodeAnalytics[](https://developers.transistor.fm/#EpisodeAnalytics "Link to this resource")

Download analytics per day for a single episode.

Fields
------

| Name | Type | Description |
| --- | --- | --- |
| downloads | Array | An array of download counts per day |
| end_date | String | Ending date of the analytics date range |
| start_date | String | Starting date of the analytics date range |

Relationships
-------------

| Name | Type |
| --- | --- |
| episode | A single [Episode resource](https://developers.transistor.fm/#Episode) |

[](https://developers.transistor.fm/)
### AudioUpload[](https://developers.transistor.fm/#AudioUpload "Link to this resource")

Authorized audio upload resource, including the upload_url to upload the audio file to, and the content_type to use when uploading.

Fields
------

| Name | Type | Description |
| --- | --- | --- |
| audio_url | String | URL of your audio file after uploading is complete. To be used when creating or updating an episode |
| content_type | String | Content type of the file to upload. audio/mpeg, audio/wav, etc |
| expires_in | Integer | Amount of time in seconds before the authorized upload URL expires |
| upload_url | String | Endpoint URL to upload your audio file to using HTTP PUT |

Relationships
-------------

 None. 

[](https://developers.transistor.fm/)
### Webhook[](https://developers.transistor.fm/#Webhook "Link to this resource")

An individual subscription to a Transistor webhook. Limited to a maximum of 50 webhooks per user account.

Fields
------

| Name | Type | Description |
| --- | --- | --- |
| created_at | String | Timestamp of creation |
| event_name | String | Name of webhook event |
| updated_at | String | Timestamp of last update |
| url | String | Target URL for webhook delivery |

Relationships
-------------

| Name | Type |
| --- | --- |
| user | A single [User resource](https://developers.transistor.fm/#User) |
| show | A single [Show resource](https://developers.transistor.fm/#Show) |

[Back to the top](https://developers.transistor.fm/#intro)
