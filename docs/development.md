# Development

This integration focuses on [Hexnode](https://www.hexnode.com/) and is using
[Hexnode API](https://www.hexnode.com/mobile-device-management/developers/) for
interacting with the Hexnode resources.

## Provider account setup

1. Sign-up for a Hexnode account
2. Take note of the provided domain
3. In the dashboard, go to Admin > API.
4. Select Enable API Access
5. Generate an API key

## Authentication

Provide the `API_KEY`, `HOSTNAME`, and the company `EMAIL` that you used to
register for the account to the `.env`. You can use
[`.env.example`](../.env.example) as a reference.

The API Key will be used to authorize requests using Basic Authorization.
