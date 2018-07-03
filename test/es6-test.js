import Share from 'tencent-share';

Share.setShareInfo(shareData);

document.querySelector('.btn').addEventListener('click', function(){
    Share.show();
})