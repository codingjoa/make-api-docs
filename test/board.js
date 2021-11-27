const DocsBuilder = require('../src/DocsBuilder');
const DocsBundle = require('../src/DocsBundle');
const FormData = require('form-data');
const fs = require('fs');
function File() {}

const stream = process.stdout;
const baseUrl = 'http://127.0.0.1:48000/';
async function flow() {
  const boardId = await board();
  await boardDetail(boardId);
  return;
    /*
`${await board()}
await boardDetail();
${await boardRating()}
${await boardComment()}
${await boardCommentDetail()}
${await boardLike()}
`
*/
}
flow();

async function boardDetail(boardId) {
  /*
  const formData = new FormData();
  formData.append('overwrite', 98);
  formData.append('overwrite', 100);
  formData.append('overwrite', 101);
  //formData.append('images', fs.createReadStream('logo512.png'));
  //formData.append('images', fs.createReadStream('logo192.png'));
  formData.append('content', '사진 덮어쓰기');
  formData.append('hashtags', '개냥이');
  formData.append('hashtags', '단또');
  */
  stream.write(
    `### board-content\n\n`
  );
  const BOARD_READ = await DocsBundle({
    method: 'GET',
    url: '/api/v1/board/:boardId',
    bind: {
      ':boardId': boardId,
    },
    baseUrl,
    stream,
    params(api) {
      return api.addParameter({
        name: ':boardId',
        type: Number,
        description: '게시글 번호'
      });
    }
  });
  const BOARD_UPDATE = await DocsBundle({
    method: 'PUT',
    url: '/api/v1/board/:boardId',
    bind: {
      ':boardId': boardId,
    },
    data: {
      overwrite: [ 98, 100 ],
      content: '사진 덮어쓰기',
      hashtags: ['개냥이', '단또'],
    },
    contentTypes: ['application/json', 'multipart/form-data'],
    baseUrl,
    stream,
    params(api) {
      return api.addParameter({
        name: ':boardId',
        type: Number,
        description: '게시글 번호'
      }).addParameter({
        name: 'content',
        type: String,
        description: '게시글 본문',
      })
      .addParameter({
        name: 'hashtags',
        type: [String],
        description: '해시태그 목록(덮어쓰기)',
        default: [],
      })
      .addParameter({
        name: 'images',
        type: [File],
        description: '게시글 사진 추가(기존 포함 최대 4개)',
        default: [],
      })
      .addParameter({
        name: 'overwrite',
        type: [Number],
        description: '남겨둘 기존 사진 ID',
        default: [],
      });
    }
  });
  const BOARD_DELETE = await DocsBundle({
    method: 'DELETE',
    url: '/api/v1/board/:boardId',
    bind: {
      ':boardId': boardId,
    },
    baseUrl,
    stream,
    params(api) {
      return api.addParameter({
        name: ':boardId',
        type: Number,
        description: '게시글 번호'
      });
    }
  });
}

async function board() {
  /*
  const formData = new FormData();
  formData.append('images', fs.createReadStream('logo512.png'));
  formData.append('images', fs.createReadStream('logo192.png'));
  formData.append('content', '우리집 개냥이들 넘 귀여어어어~~');
  formData.append('hashtags', '개냥이');
  formData.append('hashtags', '단또');
  */
  stream.write(
    `### board\n\n`
  );
  const BOARD_READ = await DocsBundle({
    method: 'GET',
    url: '/api/v1/board',
    data: {
      start: 1,
      end: 3,
    },
    baseUrl,
    stream,
    params(api) {
      return api.addParameter({
        name: 'start',
        type: Number,
        description: '검색 시작점',
        default: 0,
      })
      .addParameter({
        name: 'end',
        type: Number,
        description: '검색 개수',
        default: 15,
      })
      .addParameter({
        name: 'keyword',
        type: String,
        description: '사용자 닉네임 또는 해시태그',
        default: ''
      })
      .addParameter({
        name: 'userId',
        type: Number,
        description: '사용자 ID',
        default: ''
      });
    }
  });
  const BOARD_CREATE = await DocsBundle({
    method: 'POST',
    url: '/api/v1/board',
    data: {
      content: '우리집 개냥이들 넘 귀여어어어~~',
      hashtags: ['개냥이', '단또'],
    },
    contentTypes: ['application/json', 'multipart/form-data'],
    baseUrl,
    stream,
    params(api) {
      return api.addParameter({
        name: 'content',
        type: String,
        description: '게시글 본문',
      })
      .addParameter({
        name: 'hashtags',
        type: [String],
        description: '해시태그 목록',
        default: [],
      })
      .addParameter({
        name: 'images',
        type: [File],
        description: '게시글 사진(최대 4개)',
        default: [],
      });
    }
  });
  return BOARD_CREATE?.data?.boardId ?? 0;
}






async function boardRating() {
  const R = await new DocsBuilder('GET', '/api/v1/board/rating')
  .test({
    withResponse: true
  });
  return (
`${R}
`
  );
}
async function boardLike() {
  const sharedParameter = {
    name: ':boardId',
    type: Number,
    description: '게시글 번호',
  };

  const U = await new DocsBuilder('PUT', '/api/v1/board/:boardId/like')
  .addParameter(sharedParameter)
  .addParameter({
    name: 'like',
    type: Boolean,
    description: 'true: like, false: dislike',
  })
  .addTestCase({
    ':boardId': 32,
    like: true,
  })
  .test();
  const R = await new DocsBuilder('GET', '/api/v1/board/:boardId/like')
  .addParameter(sharedParameter)
  .addTestCase({
    ':boardId': 32,
  })
  .test();
  const D = await new DocsBuilder('DELETE', '/api/v1/board/:boardId/like')
  .addParameter(sharedParameter)
  .addTestCase({
    ':boardId': 32,
  })
  .test();
  return (
`${R}
${U}
${D}
`
  );
}
async function boardComment() {
  const C = await new DocsBuilder('POST', '/api/v1/board/:boardID/comment')
  .addParameter({
    name: ':boardID',
    type: Number,
    description: '게시글 번호',
    example: 27,
  })
  .addParameter({
    name: 'content',
    type: String,
    description: '내용',
    example: '좋은 하루입니다.',
  })
  .test();
  const R = await new DocsBuilder('GET', '/api/v1/board/:boardID/comment')
  .addParameter({
    name: ':boardID',
    type: Number,
    description: '게시글 번호',
    example: 27,
  })
  .test();
  return (
`${R}
${C}
`
  );
}
async function boardCommentDetail() {
  const U = await new DocsBuilder('PUT', '/api/v1/board/:boardID/comment/:commentID')
  .addParameter({
    name: ':boardID',
    type: Number,
    description: '게시글 번호',
    example: 27,
  })
  .addParameter({
    name: ':commentID',
    type: Number,
    description: '댓글 번호',
    example: 2,
  })
  .addParameter({
    name: 'content',
    type: String,
    description: '내용',
    example: '좋은 생각입니다.',
  })
  .test();
  const D = await new DocsBuilder('DELETE', '/api/v1/board/:boardID/comment/:commentID')
  .addParameter({
    name: ':boardID',
    type: Number,
    description: '게시글 번호',
    example: 27,
  })
  .addParameter({
    name: ':commentID',
    type: Number,
    description: '댓글 번호',
    example: 2,
  })
  .test();
  return (
`${U}
${D}
`
  );
}
