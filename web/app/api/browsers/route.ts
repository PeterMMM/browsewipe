const BASE_URL = process.env.EXTERNAL_API_DOMAIN;

type Filters = {
  userId?: number;
  searchTerm?: string;
}

function buildFetchUrl(filters: Filters) : string {
  const { userId } = filters;
  const params = new URLSearchParams();
  console.log("userId-"+userId);
  if (userId) {
    params.append('userId', userId.toString());
  }
  let url = `${BASE_URL}/posts`;

  const queryString = params.toString();
  console.log("querySting-"+queryString);
  if (queryString) {
    url += `?${queryString}`;
  }
  return url;
}

// Get all posts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = Number(searchParams.get('userId'));
  const searchTerm = searchParams.get('searchTerm') || '';
  const apiUrl = buildFetchUrl({
    userId,
    searchTerm,
  });
  const data = await fetch(apiUrl);
  if (!data.ok) {
    return new Response(data.statusText || 'Failed to fetch post', {
      status: data.status
    });
  }

  let posts = await data.json();

  // Filter (Added because searchTerm not work in dummy test api)
  if (posts && typeof searchTerm === 'string' && searchTerm.trim() !== '') {
    const searchLower = searchTerm.toLowerCase();
    posts = posts.filter(item => {
      const itemTitle = item.title.toLowerCase();
      return itemTitle.includes(searchLower);
    });
  }
  // const { items, } = paginate()
  // return Response.json({
  //   status: 'success',
  //   page,
  //   limit,
  //   total: 100,
  //   data,
  // })
  return Response.json(posts);
}

// Data format
// {
//   title: 'foo',
//   body: 'bar',
//   userId: 1,
// }
// Create Post
export async function POST(
  request: Request
) {
  try {
    const data = await request.json();

    const response = await fetch(`${BASE_URL}/posts`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    });

    if (!response.ok) {
      throw new Error(`External API failed witih status: ${response.status}`);
    }

    const json = await response.json();
    console.log("Created post-",json);

    return Response.json({
      status: 'success',
      message: 'Successfully created.',
      data: json,
    }, { status: 201 });

  } catch (error) {
    console.error("POST Error:", error);
    return Response.json({
      status: 'fail',
      message: 'Fail to create.',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
