const BASE_URL = process.env.EXTERNAL_API_DOMAIN;

// {
//   id: 1,
//   title: 'foo',
//   body: 'bar',
//   userId: 1,
// })
// PUT - Update post by id
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    var data = await request.json();

    console.log("Incoming PUT data:", data);
    console.log("BASE_URL:", BASE_URL);
    console.log("Target URL:", `${BASE_URL}/posts/${id}`);

    const response = await fetch(`${BASE_URL}/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    });

    if (! response.ok) {
      throw new Error(`External API failed with status: ${response.status}`);
    }

    const json = await response.json();
    console.log("Updated post : ", json);

    return Response.json({
      status: 'success',
      message: 'Successfully updated.',
      data: json,
    });
  } catch (error) {
    console.error("PUT error:", error);
    return Response.json({
      status: 'fail',
      message: 'Fail to update.',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const response = await fetch(`${BASE_URL}/posts/${id}`, {
      method: 'DELETE',
    });

    if (! response.ok) {
      throw new Error(`External API failed with status: ${response.status}`);
    }

    return Response.json({
      status: 'success',
      message: `Successfully deleted post ID: ${id}.`,
    });
  } catch (error) {
    return Response.json({
      status: 'fail',
      message: 'Fail to delete.',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}